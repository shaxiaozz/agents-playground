import { AgentDispatchClient } from 'livekit-server-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const LIVEKIT_URL = process.env.LIVEKIT_HTTPS_URL;
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (!LIVEKIT_URL || !API_KEY || !API_SECRET) {
      throw new Error('Missing LiveKit configuration');
    }

    const { roomName, agentName } = req.body;

    const agentDispatchClient = new AgentDispatchClient(
      LIVEKIT_URL,
      API_KEY,
      API_SECRET
    );

    const dispatch = await agentDispatchClient.createDispatch(roomName, agentName, {
      metadata: JSON.stringify({
        type: 'voice_assistant',
        role: agentName,
        version: '1.0'
      }),
    });

    const dispatches = await agentDispatchClient.listDispatch(roomName);

    return res.json({
      dispatch,
      dispatchCount: dispatches.length,
    });

  } catch (error) {
    console.error('Dispatch error:', error);
    return res.status(503).json({ 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 