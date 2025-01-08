export async function dispatchAgent(roomName: string, agentName: string) {
  try {
    const response = await fetch('/api/dispatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName,
        agentName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to dispatch agent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error dispatching agent:', error);
    throw error;
  }
} 