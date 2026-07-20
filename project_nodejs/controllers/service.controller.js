const { Service } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");

const getAllService = async (req, res) => {
  try {
    const { search, des } = req.query;
    if (search) {
      const services = await Service.findAll({
        where: {
          [Op.or]: [{ service_name: { [Op.like]: `%${search}%` } }],
        },
      });
      return res.status(200).json({
        success: true,
        message: "fetched services successfully",
        data: services,
      });
    }
    if (des) {
      const services = await Service.findAll({
        where: {
          [Op.or]: [{ description: { [Op.like]: `%${des}%` } }],
        },
      });
      return res.status(200).json({
        success: true,
        message: "fetched services successfully",
        data: services,
      });
    }
    const services = await Service.findAll();
    return res.status(200).json({
      success: true,
      message: "fetched services successfully",
      data: services,
    });
  } catch (error) {
    logError("getAllService", error, res);
  }
};


function requireCheck(service_name, description, price) {
    if(!service_name){
        return res.status(400).json({
            success: false,
            message: "Service name is required",
        });
    }
    if(!description){
        return res.status(400).json({
            success: false,
            message: "Description is required",
        });
    }
    if(!price){
        return res.status(400).json({
            success: false,
            message: "Price is required",
        });
    }
}
const createService = async (req, res) => {
    try{
        const {service_name, description, price} = req.body;

        requireCheck(service_name, description, price);

        const service = await Service.create({service_name, description, price});
        return res.status(200).json({
            success: true,
            message: "Service created successfully",
            data: service
        });
    }catch(error){
        logError("createService", error, res);
    }
};

const updateService = async (req, res) => {
    try{
        const {id} = req.params;
        const {service_name, description, price} = req.body;

        requireCheck(service_name, description, price);

        const checkById = await Service.findByPk(id);
        if(!checkById){
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        const service = await Service.update({service_name, description, price}, {where:{id}});
        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: checkById,
        });
    }catch(error){
        logError("updateService", error, res);
    }
};

const deleteService = async (req, res) => {
    try{
        const {id} = req.params;
        const checkById = await Service.findByPk(id);
        if(!checkById){
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        const service = await Service.destroy({where:{id}});
        return res.status(200).json({
            success: true,
            message: "Service deleted successfully",
            data: checkById,
        });
    }catch(error){
        logError("deleteService", error, res);
    }
};

module.exports = { getAllService, createService, updateService, deleteService };
