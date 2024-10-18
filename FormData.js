const mongoose = require('mongoose');

// Define plan schema as an embedded document
const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  tasks: Number,
  profitPerTask: Number,
  totalProfit: Number,
  completedTasks: {
    type: Number,
    default: 0  // Track number of completed tasks per plan
  }
});

// Define user form schema
const formDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: '1234',
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number'],
  },
  workType: {
    type: String,
    enum: ['full-time', 'part-time'],
    required: true,
  },
  hasLaptop: {
    type: String,
    enum: ['yes', 'no'],
  },
  hasMobile: {
    type: String,
    enum: ['yes', 'no'],
  },
  currentPlan: {
    type: String, 
    default: 'Plan A',
    enum: ['Plan A', 'Plan B', 'Plan C', 'Plan D'],
  },

  plans: [planSchema],  // Allow multiple plans
});

// Pre-save hook to assign default plan if no plan is set
formDataSchema.pre('save', function (next) {
  // If no plan is assigned, set Plan A as default
  if (this.plans.length === 0) {
    this.plans.push({
      name: 'Plan A',
      price: 0,
      tasks: 50,
      profitPerTask: 5,
      totalProfit: 250,
      completedTasks: 0
    });
  }
  next();
});

// Method to add a new plan to the user
formDataSchema.methods.addPlan = function (plan) {
  this.plans.push(plan);
  return this.save();
};

// Method to complete a task in a specific plan
formDataSchema.methods.completeTask = function (planName) {
  const plan = this.plans.find(p => p.name === planName);
  if (plan && plan.completedTasks < plan.tasks) {
    plan.completedTasks += 1;
    return this.save();
  } else {
    throw new Error('All tasks completed or plan not found.');
  }
};

module.exports = mongoose.model('User', formDataSchema);
