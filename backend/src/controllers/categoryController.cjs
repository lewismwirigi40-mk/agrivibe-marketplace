const Category = require('../models/Category.cjs');

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon, color, parent_id, display_order } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const category = await Category.create({
            name,
            slug,
            description,
            icon,
            color,
            parent_id,
            display_order: display_order || 0
        });

        res.status(201).json({
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { is_active: true },
            order: [['display_order', 'ASC']]
        });

        return res.json({ categories: categories || [] });
    } catch (error) {
        console.error('Get categories error:', error);
        // 🔴 THIS WILL CONFIRM THE DATABASE ERROR:
        return res.status(500).json({ 
            error: 'Failed to fetch categories',
            message: error.message 
        });
    }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ category });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const { name, description, icon, color, parent_id, is_active, display_order } = req.body;

        await category.update({
            name,
            description,
            icon,
            color,
            parent_id,
            is_active,
            display_order
        });

        res.json({
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await category.destroy();

        res.json({ message: 'Category deleted successfully' });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// Get Categories with Subcategories
exports.getCategoryTree = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null, is_active: true },
            include: [{
                model: Category,
                as: 'subcategories',
                where: { is_active: true },
                required: false
            }],
            order: [['display_order', 'ASC']]
        });

        res.json({ categories });
    } catch (error) {
        console.error('Get category tree error:', error);
        res.status(500).json({ error: 'Failed to fetch category tree' });
    }
};