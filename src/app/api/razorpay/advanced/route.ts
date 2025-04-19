import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST() {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: 99900, 
    currency: 'INR',
    receipt: `rcpt_advanced_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
