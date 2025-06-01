import json
import asyncio
import logging
import requests
import uuid
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

# Global rate limiting - track last request time to prevent 429 errors
_last_request_time = 0
_min_request_interval = 2.0  # Minimum 2 seconds between requests

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Accept WebSocket connection and initialize session"""
        # Accept the connection first
        await self.accept()
        
        # Initialize session data
        await self.init_session_data()
        
        logger.info(f"WebSocket connection established")

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        logger.info(f"WebSocket disconnected, code: {close_code}")

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            logger.info(f"Received message type: {message_type}")
            
            if message_type == 'USER_PROMPT':
                await self.handle_user_prompt(data.get('text', ''))
            else:
                logger.warning(f"Unknown message type: {message_type}")
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            await self.send_error("Invalid message format")
        except Exception as e:
            logger.error(f"Error handling message: {str(e)}")
            await self.send_error("Internal server error")

    async def handle_user_prompt(self, prompt_text):
        """Handle user prompt and call LYZR API"""
        logger.info(f"Processing user prompt: {prompt_text[:50]}...")
        
        if not prompt_text.strip():
            await self.send_error("Empty prompt received")
            return
            
        session_data = await self.get_session_data()
        
        # Check if credits are exhausted
        if session_data['monthly_token_count'] >= session_data['monthly_credit_threshold']:
            logger.info("Credits exhausted, sending credits exhausted message")
            await self.send_credits_exhausted()
            return
        
        # Add user message to chat history
        session_data['chat_history'].append({
            'role': 'user',
            'text': prompt_text
        })
        
        try:
            logger.info("Calling LYZR API...")
            # Call LYZR API with rate limiting
            ai_response = await self.call_lyzr_api(prompt_text, session_data)
            
            if ai_response and not ai_response.startswith("API Error:"):
                logger.info(f"Got AI response: {ai_response[:100]}...")
                
                # Estimate token usage
                prompt_tokens = self.estimate_tokens(prompt_text)
                response_tokens = self.estimate_tokens(ai_response)
                total_tokens = prompt_tokens + response_tokens
                
                logger.info(f"Token usage - Prompt: {prompt_tokens}, Response: {response_tokens}, Total: {total_tokens}")
                
                # Update token count
                session_data['monthly_token_count'] += total_tokens
                
                # Check credit warnings
                threshold = session_data['monthly_credit_threshold']
                if session_data['monthly_token_count'] >= threshold:
                    await self.send_credits_exhausted()
                elif session_data['monthly_token_count'] >= 0.8 * threshold:
                    await self.send_credit_warning()
                
                # Add AI response to chat history
                session_data['chat_history'].append({
                    'role': 'agent',
                    'text': ai_response
                })
                
                # Save session data
                await self.save_session_data(session_data)
                
                # Stream the response
                await self.stream_response(ai_response)
            else:
                logger.error("No valid response from LYZR API")
                await self.send_error(ai_response or "AI service unavailable. Please try again later.")
                
        except Exception as e:
            logger.error(f"Error processing user prompt: {str(e)}", exc_info=True)
            await self.send_error("AI service unavailable. Please try again later.")

    async def call_lyzr_api(self, prompt_text, session_data):
        """Call LYZR API asynchronously with rate limiting"""
        global _last_request_time
        
        # Rate limiting: ensure minimum interval between requests
        current_time = time.time()
        time_since_last_request = current_time - _last_request_time
        if time_since_last_request < _min_request_interval:
            wait_time = _min_request_interval - time_since_last_request
            logger.info(f"Rate limiting: waiting {wait_time:.2f} seconds before API call")
            await asyncio.sleep(wait_time)
        
        session_key = str(uuid.uuid4())  # Generate a unique session key for each call
        
        # Use the format from your curl example
        payload = {
            "user_id": "irfanwork414@gmail.com",  # Use your email as user_id
            "agent_id": settings.LYZR_AGENT_ID,
            "session_id": f"{settings.LYZR_AGENT_ID}-{session_key}",
            "message": prompt_text
        }
        
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': settings.LYZR_API_KEY
        }
        
        logger.info(f"LYZR API Request - URL: {settings.LYZR_API_URL}")
        logger.info(f"LYZR API Request - Payload: {payload}")
        logger.info(f"LYZR API Request - Headers: {headers}")
        
        try:
            # Update the last request time before making the call
            _last_request_time = time.time()
            
            # Increase timeout to 300 seconds (5 minutes) for LYZR detailed responses
            # Run the HTTP request in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(
                    settings.LYZR_API_URL,
                    json=payload,
                    headers=headers,
                    timeout=300  # Increased to 5 minutes for complex responses
                )
            )
            
            logger.info(f"LYZR API Response - Status: {response.status_code}")
            logger.info(f"LYZR API Response - Content: {response.text[:500]}...")
            
            # ✅ DETAILED RESPONSE LOGGING FOR DEBUGGING
            print("=" * 80)
            print("🔍 LYZR API FULL RESPONSE DEBUG INFO")
            print("=" * 80)
            print(f"📊 Status Code: {response.status_code}")
            print(f"📋 Headers: {dict(response.headers)}")
            print(f"📄 Raw Content (first 1000 chars): {response.text[:1000]}")
            print(f"📄 Full Raw Content: {response.text}")
            
            try:
                response_json = response.json()
                print(f"📦 JSON Response Type: {type(response_json)}")
                print(f"📦 JSON Response: {response_json}")
                
                if isinstance(response_json, dict):
                    print(f"🔑 Available Keys: {list(response_json.keys())}")
                    for key, value in response_json.items():
                        print(f"   {key}: {type(value)} = {str(value)[:200]}...")
                elif isinstance(response_json, list):
                    print(f"📝 List Length: {len(response_json)}")
                    if response_json:
                        print(f"📝 First Item: {response_json[0]}")
                        print(f"📝 First Item Type: {type(response_json[0])}")
                        if isinstance(response_json[0], dict):
                            print(f"📝 First Item Keys: {list(response_json[0].keys())}")
            except Exception as json_error:
                print(f"❌ JSON Parse Error: {json_error}")
                print(f"❌ Response is not valid JSON")
            
            print("=" * 80)
            print("🔍 END LYZR API DEBUG INFO")
            print("=" * 80)
            
            if response.status_code == 200:
                response_data = response.json()
                # Extract the AI response text from the response
                # Try different possible keys based on LYZR API response format
                ai_text = (
                    response_data.get('response') or 
                    response_data.get('message') or 
                    response_data.get('content') or 
                    response_data.get('text') or
                    response_data.get('answer') or
                    response_data.get('data', {}).get('response') if isinstance(response_data.get('data'), dict) else None or
                    response_data.get('data', {}).get('message') if isinstance(response_data.get('data'), dict) else None or
                    response_data.get('result') or
                    response_data.get('output')
                )
                
                # If we couldn't extract a clean response, but have response_data, 
                # it might be a complex structure - return just the response field if it exists
                if not ai_text and 'response' in response_data:
                    ai_text = response_data['response']
                
                # Last resort - convert the entire response to string if it's not too complex
                if not ai_text:
                    # Don't return massive JSON structures, only if it looks like a simple response
                    response_str = str(response_data)
                    if len(response_str) < 10000:  # Reasonable limit
                        ai_text = response_str
                    else:
                        ai_text = "Unable to parse AI response. Please try again."
                
                print(f"✅ Extracted AI Text: {ai_text[:200]}...")
                return ai_text
            elif response.status_code == 429:
                # Handle rate limiting specifically
                logger.error(f"LYZR API rate limit hit: {response.text}")
                retry_after = response.headers.get('Retry-After', '60')
                return f"Rate limit exceeded. Please wait {retry_after} seconds before sending another message."
            else:
                logger.error(f"LYZR API error: {response.status_code} - {response.text}")
                return f"API Error: {response.status_code} - Unable to process your request at this time."
                
        except requests.Timeout:
            logger.error("LYZR API timeout after 300 seconds")
            return "Request timeout after 300 seconds. LYZR is taking longer than expected to generate your response. Please try a shorter prompt or try again later."
        except Exception as e:
            logger.error(f"LYZR API call failed: {str(e)}", exc_info=True)
            return f"Service error: {str(e)}"

    async def stream_response(self, response_text):
        """Stream AI response token by token"""
        logger.info(f"Streaming response: {response_text[:100]}...")
        
        # Split response into chunks for streaming
        chunk_size = 20  # Characters per chunk
        chunks = [response_text[i:i+chunk_size] for i in range(0, len(response_text), chunk_size)]
        
        for i, chunk in enumerate(chunks):
            await self.send(text_data=json.dumps({
                'type': 'AI_TOKEN',
                'text': chunk
            }))
            logger.info(f"Sent chunk {i+1}/{len(chunks)}: {chunk[:20]}...")
            # Small delay to simulate real-time streaming
            await asyncio.sleep(0.05)
        
        # Send completion signal
        await self.send(text_data=json.dumps({
            'type': 'AI_DONE'
        }))
        logger.info("Streaming completed")

    async def send_error(self, message):
        """Send error message to client"""
        logger.info(f"Sending error: {message}")
        await self.send(text_data=json.dumps({
            'type': 'ERROR',
            'message': message
        }))

    async def send_credit_warning(self):
        """Send credit warning to client"""
        logger.info("Sending credit warning")
        await self.send(text_data=json.dumps({
            'type': 'CREDIT_WARNING'
        }))

    async def send_credits_exhausted(self):
        """Send credits exhausted message to client"""
        logger.info("Sending credits exhausted")
        await self.send(text_data=json.dumps({
            'type': 'CREDITS_EXHAUSTED'
        }))

    async def init_session_data(self):
        """Initialize session data if not exists"""
        if not hasattr(self, '_session_data'):
            self._session_data = {
                'chat_history': [],
                'monthly_token_count': 0,
                'monthly_credit_threshold': settings.DEFAULT_CREDIT_THRESHOLD
            }
            logger.info(f"Initialized session data with threshold: {settings.DEFAULT_CREDIT_THRESHOLD}")

    async def get_session_data(self):
        """Get session data"""
        if not hasattr(self, '_session_data'):
            await self.init_session_data()
        return self._session_data

    async def save_session_data(self, data):
        """Save session data"""
        self._session_data = data
        logger.info(f"Saved session data - Token count: {data['monthly_token_count']}")

    def estimate_tokens(self, text):
        """Estimate token count from text length"""
        return max(len(text) // 4, 1) 