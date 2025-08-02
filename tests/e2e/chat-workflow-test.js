/**
 * End-to-End Test for Chat History & Auto-Title Generation
 */



class ChatE2ETest {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
  }

  async testWorkflow() {
    console.log('🧪 Starting Chat History E2E Test...');
    
    try {
      // Test 1: Create conversation
      console.log('1. Testing conversation creation...');
      const conv = await this.createConversation();
      console.log('✅ Conversation created:', conv.id);
      
      // Test 2: Send first message (triggers auto-title)
      console.log('2. Sending first message...');
      await this.sendFirstMessage(conv.id);
      console.log('✅ Message sent');
      
      // Test 3: Wait and check title generation
      console.log('3. Waiting for title generation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updated = await this.getConversation(conv.id);
      console.log('Updated title:', updated.title);
      
      if (updated.title !== 'Test Conversation') {
        console.log('✅ Auto-title generation working!');
      } else {
        console.log('❌ Title was not auto-generated');
      }
      
      console.log('🎉 E2E Test Complete');
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }

  async createConversation() {
    const response = await fetch(`${this.baseUrl}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Conversation' })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.status}`);
    }
    
    return await response.json();
  }

  async sendFirstMessage(conversationId) {
    const response = await fetch(`${this.baseUrl}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        content: 'Help me understand React hooks and state management patterns',
        role: 'user'
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }
    
    return await response.json();
  }

  async getConversation(id) {
    const response = await fetch(`${this.baseUrl}/api/conversations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get conversation: ${response.status}`);
    }
    
    return await response.json();
  }
}

// Run the test
if (require.main === module) {
  const test = new ChatE2ETest();
  test.testWorkflow();
}

module.exports = { ChatE2ETest };
