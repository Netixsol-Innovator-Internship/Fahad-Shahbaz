import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async createPayment(data: {
    auction: Types.ObjectId;
    user: Types.ObjectId;
    bid: Types.ObjectId;
    amount: number;
    transactionId?: string;
  }): Promise<Payment> {
    const payment = new this.paymentModel(data);
    return payment.save();
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentModel
      .find()
      .populate('auction')
      .populate('user')
      .populate('bid')
      .exec();
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('auction')
      .populate('bid')
      .exec();
  }

  async updateStatus(paymentId: string, status: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = status;
    return payment.save();
  }
}
