import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Mongoose schema for the Lead model.
 */
const leadSchema = new Schema(
  {
    /**
     * The full name of the lead contact.
     * Required field, trimmed, minimum 2 characters, maximum 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Lead name must be at least 2 characters long'],
      maxlength: [100, 'Lead name cannot exceed 100 characters']
    },

    /**
     * The company name associated with the lead.
     * Required field, trimmed.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },

    /**
     * The contact email address of the lead.
     * Required field, trimmed, validated against standard email regex pattern.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address'
      }
    },

    /**
     * The contact phone number of the lead.
     * Optional field, trimmed.
     */
    phone: {
      type: String,
      trim: true
    },

    /**
     * The current status of the lead in the sales pipeline.
     * Restricted to standard CRM workflow states: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost.
     * Defaults to 'New'.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    },

    /**
     * The acquisition channel/source from where the lead originated.
     * Restricted to standard sources: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other.
     * Defaults to 'Website'.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid lead source'
      },
      default: 'Website'
    },

    /**
     * Additional custom notes, conversation summaries, or descriptions.
     * Optional field, maximum 1000 characters.
     */
    notes: {
      type: [
        {
          id: { type: String, required: true },
          date: { type: String, required: true },
          text: { type: String, required: true },
          author: { type: String, required: true }
        }
      ],
      default: []
    },

    /**
     * The projected financial valuation or deal size of the lead.
     * Optional field, defaults to 0.
     */
    value: {
      type: Number,
      default: 0
    },

    /**
     * Reference to the User (owner) who created and manages this lead.
     * Required field, maps to a valid User ID.
     */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner (User reference) is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Define indexes for fast lookup and query optimization
// Compound index on (owner, status) for fast filtered queries by user dashboard
leadSchema.index({ owner: 1, status: 1 });

// Index on email for fast lookups
leadSchema.index({ email: 1 });

// Compound indexes for sorted queries and monthly aggregations
leadSchema.index({ owner: 1, createdAt: -1 });

// Compound index for source-filtered queries
leadSchema.index({ owner: 1, source: 1 });

// Compound indexes for fast autocomplete search by owner and fields
leadSchema.index({ owner: 1, name: 1 });
leadSchema.index({ owner: 1, company: 1 });
leadSchema.index({ owner: 1, email: 1 });

/**
 * Virtual property returning the age of the lead in days since creation.
 * Calculated dynamically based on the 'createdAt' timestamp.
 * @returns {number} The age of the lead in whole days.
 */
leadSchema.virtual('age').get(function() {
  if (!this.createdAt) {
    return 0;
  }
  const diffInMs = Date.now() - this.createdAt.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return Math.floor(diffInDays);
});

export const Lead = mongoose.model('Lead', leadSchema);
export { leadSchema };
export default Lead;
