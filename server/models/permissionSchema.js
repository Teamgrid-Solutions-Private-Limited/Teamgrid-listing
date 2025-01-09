const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        // Listings Permissions
        'create_listing', 
        'update_listing',
        'delete_listing',
        'view_listing',
        'approve_listing',
        'promote_listing',
  
        // User Management
        'manage_users',
        'view_users',
  
        // Reviews and Testimonials
        'create_review',
        'delete_review',
        'approve_review',
  
        // Builder/Project Management
        'create_project',
        'update_project',
        'delete_project',
        'view_project',
        'approve_project',
  
        // Revenue/Finance
        'view_revenue',
        'manage_payments',
  
        // Community/Forum
        'post_in_forum',
        'delete_forum_post',
        'moderate_forum_post',
  
        // Analytics and Reporting
        'view_analytics',
  
        // Others
        'contact_sellers',
        'manage_favorites',
        'use_advanced_search',
      ],
    },
    description: {
      type: String,
      default: '',
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('permission', permissionSchema);
  