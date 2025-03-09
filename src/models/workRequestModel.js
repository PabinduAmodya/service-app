class WorkRequest {
    constructor(userId, workerId, title, description, location, budget, deadline, status = 'pending') {
      this.userId = userId;           // ID of the user making the request
      this.workerId = workerId;       // ID of the worker being requested
      this.title = title;             // Brief title of the work request
      this.description = description; // Detailed description of work needed
      this.location = location;       // Where the work is to be performed
      this.budget = budget;           // Budget for the work (optional)
      this.deadline = deadline;       // When the work needs to be completed by
      this.status = status;           // Status: pending, accepted, rejected, completed, cancelled
      this.createdAt = new Date();    // When the request was created
      this.updatedAt = new Date();    // When the request was last updated
      this.messages = [];             // Array to store communication between user and worker
    }
  
    // Add a message to the conversation
    addMessage(senderId, content) {
      this.messages.push({
        senderId,
        content,
        timestamp: new Date()
      });
      this.updateTimestamp();
    }
  
    // Update the status of the request
    updateStatus(newStatus) {
      const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
      if (validStatuses.includes(newStatus)) {
        this.status = newStatus;
        this.updateTimestamp();
        return true;
      }
      return false;
    }
  
    // Update the timestamp
    updateTimestamp() {
      this.updatedAt = new Date();
    }
  }
  
  export default WorkRequest;