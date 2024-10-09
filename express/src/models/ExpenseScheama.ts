import mongoose from "mongoose";


interface IExpenseScheama {
    title: string;
    status: string;
    amount: number;
    authorId: mongoose.Types.ObjectId;
}

const ExpenseScheama = new mongoose.Schema<IExpenseScheama>({
    title: { type: String, required: true, maxlength: 30 },
    status: { type: String, required: true, maxlength: 10 },
    amount: { type: Number, required: true, maxlength: 100000000, },
    authorId: { type: mongoose.Schema.ObjectId, required: true, },
},
    { timestamps: true }
)

const Expense = mongoose.model('ExpenseScheama', ExpenseScheama)

export default Expense