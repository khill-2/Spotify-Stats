import express from 'express';
import supabase from './supabaseClient.js';

const router = express.Router();

router.get('/ping', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*').limit(1);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Supabase is working!', sampleUser: data });
});

export default router;
