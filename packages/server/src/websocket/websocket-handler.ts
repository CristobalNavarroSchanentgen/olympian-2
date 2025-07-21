        content: fullResponse,
        metadata: { streaming: false, completed: true }
      });

      // Emit completion
      this.io.to(`conversation:${data.conversationId}`).emit('chat:complete', {
        messageId: assistantMessage.id,
        fullContent: fullResponse
      });

      // Update conversation timestamp
      await this.dbService.updateConversation(data.conversationId, {
        updatedAt: new Date()
      });

    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat:error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleToolExecution(socket: Socket, data: {
    serverName: string;
    toolName: string;
    arguments: any;
  }): Promise<void> {
    try {
      const result = await this.mcpManager.executeTool(
        data.serverName,
        data.toolName,
        data.arguments
      );

      socket.emit('tool:result', result);
    } catch (error) {
      socket.emit('tool:error', {
        error: error instanceof Error ? error.message : 'Tool execution failed'
      });
    }
  }

  private async handleImageUpload(socket: Socket, data: {
    conversationId: string;
    imageData: string;
    filename: string;
  }): Promise<void> {
    try {
      // Process image data (base64)
      const imageBuffer = Buffer.from(data.imageData.split(',')[1], 'base64');
      
      // Here you would typically save to file system or cloud storage
      // For now, we'll just acknowledge the upload
      
      socket.emit('image:uploaded', {
        success: true,
        filename: data.filename,
        size: imageBuffer.length
      });
    } catch (error) {
      socket.emit('image:error', {
        error: error instanceof Error ? error.message : 'Image upload failed'
      });
    }
  }

  private async executeTool(conversationId: string, toolCall: any): Promise<void> {
    try {
      const result = await this.mcpManager.executeTool(
        toolCall.server || 'unknown',
        toolCall.function.name,
        toolCall.function.arguments
      );

      // Broadcast tool execution result
      this.io.to(`conversation:${conversationId}`).emit('tool:executed', {
        toolCall,
        result
      });
    } catch (error) {
      this.io.to(`conversation:${conversationId}`).emit('tool:error', {
        toolCall,
        error: error instanceof Error ? error.message : 'Tool execution failed'
      });
    }
  }

  private sendSystemStatus(socket: Socket): void {
    const mcpStatus = this.mcpManager.getServerStatus();
    const tools = this.mcpManager.getAllTools();

    socket.emit('status:update', {
      mcp: {
        servers: mcpStatus,
        tools: tools.length
      },
      database: {
        connected: true // TODO: actual health check
      },
      ollama: {
        connected: this.ollamaService.isConnected()
      }
    });
  }
}
