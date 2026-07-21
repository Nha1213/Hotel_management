const { Service, ServiceOrder: ServiceOrderModel } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");

// Helper function: Returns an error message string if invalid, or null if valid
const validateServiceInput = (
  service_name,
  description,
  price,
  serviceOrders,
) => {
  if (!service_name) return "Service name is required";
  if (!description) return "Description is required";
  if (!price) return "Price is required";
  if (
    !serviceOrders ||
    !Array.isArray(serviceOrders) ||
    serviceOrders.length === 0
  ) {
    return "Service orders are required and must be a non-empty array";
  }
  return null;
};

const getAllService = async (req, res) => {
  try {
    const { search, des } = req.query;
    const whereConditions = [];

    if (search) {
      whereConditions.push({ service_name: { [Op.like]: `%${search}%` } });
    }
    if (des) {
      whereConditions.push({ description: { [Op.like]: `%${des}%` } });
    }

    const whereClause =
      whereConditions.length > 0 ? { [Op.or]: whereConditions } : {};

    const services = await Service.findAll({ where: whereClause });

    return res.status(200).json({
      success: true,
      message: "Fetched services successfully",
      data: services,
    });
  } catch (error) {
    return logError("getAllService", error, res);
  }
};

const createService = async (req, res) => {
  const t = await Service.sequelize.transaction();
  try {
    const { service_name, description, price, serviceOrders } = req.body;

    const validationError = validateServiceInput(
      service_name,
      description,
      price,
      serviceOrders,
    );
    if (validationError) {
      await t.rollback();
      return res.status(400).json({ success: false, message: validationError });
    }

    const service = await Service.create(
      { service_name, description, price },
      { transaction: t },
    );

    const ordersToCreate = serviceOrders.map((order) => ({
      reservation_id: order.reservation_id,
      service_id: service.id,
      quantity: order.quantity,
      total: order.total,
      order_date: order.order_date,
    }));

    await ServiceOrderModel.bulkCreate(ordersToCreate, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: [
        {
            service: service,
            service_orders: ordersToCreate
        }
      ],
    });
  } catch (error) {
    await t.rollback();
    return logError("createService", error, res);
  }
};

const updateService = async (req, res) => {
  const t = await Service.sequelize.transaction();
  try {
    const { id } = req.params;
    const { service_name, description, price, serviceOrders } = req.body;

    if (!id) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Service id is required" });
    }

    const validationError = validateServiceInput(
      service_name,
      description,
      price,
      serviceOrders,
    );
    if (validationError) {
      await t.rollback();
      return res.status(400).json({ success: false, message: validationError });
    }

    const existingService = await Service.findByPk(id);
    if (!existingService) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Update main service details
    await existingService.update(
      { service_name, description, price },
      { transaction: t },
    );

    // Sync child orders (Delete existing orders and re-insert updated list)
    await ServiceOrderModel.destroy({
      where: { service_id: id },
      transaction: t,
    });

    const ordersToCreate = serviceOrders.map((order) => ({
      reservation_id: order.reservation_id,
      service_id: id,
      quantity: order.quantity,
      total: order.total,
      order_date: order.order_date,
    }));

    await ServiceOrderModel.bulkCreate(ordersToCreate, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: existingService,
    });
  } catch (error) {
    await t.rollback();
    return logError("updateService", error, res);
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.destroy();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: service,
    });
  } catch (error) {
    return logError("deleteService", error, res);
  }
};

module.exports = { getAllService, createService, updateService, deleteService };
