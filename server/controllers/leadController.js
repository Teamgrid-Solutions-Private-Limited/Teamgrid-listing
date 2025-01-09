const Lead = require('../models/leadSchema');
const Property = require('../models/propertySchema');

class leadController {
  
  // Create a new lead
 static createLead = async (req, res) => {
    try {
      const { name, email, phone, status, propertyId } = req.body;

      // Check if the property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Create and save the new lead
      const newLead = new Lead({ name, email, phone, status, propertyId });
      await newLead.save();

      res.status(201).json({ message: 'Lead created successfully', lead: newLead });
    } catch (err) {
      console.error("Error creating lead:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get all leads
 static getAllLeads = async (req, res) => {
    try {
      const leads = await Lead.find().populate('propertyId', 'title location price');
      res.status(200).json(leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get leads for a specific property
static  getLeadsForProperty = async (req, res) => {
    try {
      const { propertyId } = req.params;
      const leads = await Lead.find({ propertyId }).populate('propertyId', 'title location price');
      res.status(200).json(leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update lead status
static  updateLead = async (req, res) => {
    try {
      const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!lead) return res.status(404).json({ message: "Lead not found" });

      res.status(200).json({ message: 'Lead updated successfully', lead });
    } catch (err) {
      console.error("Error updating lead:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete lead
 static deleteLead = async (req, res) => {
    try {
      const lead = await Lead.findByIdAndDelete(req.params.id);
      if (!lead) return res.status(404).json({ message: "Lead not found" });

      res.status(200).json({ message: "Lead deleted successfully" });
    } catch (err) {
      console.error("Error deleting lead:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = leadController;
