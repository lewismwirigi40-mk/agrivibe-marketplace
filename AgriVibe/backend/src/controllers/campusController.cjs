const Campus = require('../models/Campus.cjs');

// Create Campus
exports.createCampus = async (req, res) => {
    try {
        const {
            name, institution_name, institution_type, description,
            address, latitude, longitude, city, country,
            student_population, website, contact_email, contact_phone
        } = req.body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const campus = await Campus.create({
            name,
            slug,
            institution_name,
            institution_type: institution_type || 'university',
            description,
            address,
            latitude,
            longitude,
            city,
            country: country || 'Kenya',
            student_population,
            website,
            contact_email,
            contact_phone,
            is_active: true
        });

        res.status(201).json({
            message: 'Campus created successfully',
            campus
        });

    } catch (error) {
        console.error('Create campus error:', error);
        res.status(500).json({ error: 'Failed to create campus' });
    }
};

// Get All Campuses
exports.getAllCampuses = async (req, res) => {
    try {
        const campuses = await Campus.findAll({
            where: { is_active: true },
            order: [['name', 'ASC']]
        });

        res.json({ campuses });
    } catch (error) {
        console.error('Get campuses error:', error);
        res.status(500).json({ error: 'Failed to fetch campuses' });
    }
};

// Get Campus by ID
exports.getCampusById = async (req, res) => {
    try {
        const { id } = req.params;
        const campus = await Campus.findByPk(id);

        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }

        res.json({ campus });
    } catch (error) {
        console.error('Get campus error:', error);
        res.status(500).json({ error: 'Failed to fetch campus' });
    }
};

// Get Campus by Slug
exports.getCampusBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const campus = await Campus.findOne({
            where: { slug, is_active: true }
        });

        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }

        res.json({ campus });
    } catch (error) {
        console.error('Get campus by slug error:', error);
        res.status(500).json({ error: 'Failed to fetch campus' });
    }
};

// Update Campus
exports.updateCampus = async (req, res) => {
    try {
        const { id } = req.params;
        const campus = await Campus.findByPk(id);

        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }

        await campus.update(req.body);

        res.json({
            message: 'Campus updated successfully',
            campus
        });

    } catch (error) {
        console.error('Update campus error:', error);
        res.status(500).json({ error: 'Failed to update campus' });
    }
};

// Delete Campus
exports.deleteCampus = async (req, res) => {
    try {
        const { id } = req.params;
        const campus = await Campus.findByPk(id);

        if (!campus) {
            return res.status(404).json({ error: 'Campus not found' });
        }

        await campus.destroy();

        res.json({ message: 'Campus deleted successfully' });

    } catch (error) {
        console.error('Delete campus error:', error);
        res.status(500).json({ error: 'Failed to delete campus' });
    }
};

// Get Campuses by Type
exports.getCampusesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const campuses = await Campus.findAll({
            where: { institution_type: type, is_active: true },
            order: [['name', 'ASC']]
        });

        res.json({ campuses });
    } catch (error) {
        console.error('Get campuses by type error:', error);
        res.status(500).json({ error: 'Failed to fetch campuses' });
    }
};

// Get Campuses by City
exports.getCampusesByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const campuses = await Campus.findAll({
            where: { city, is_active: true },
            order: [['name', 'ASC']]
        });

        res.json({ campuses });
    } catch (error) {
        console.error('Get campuses by city error:', error);
        res.status(500).json({ error: 'Failed to fetch campuses' });
    }
};
