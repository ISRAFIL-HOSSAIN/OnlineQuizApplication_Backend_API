const ControlPanel = require('../models/ControlPanelSchema');
const cloudinary = require("cloudinary").v2;
const upload = require("../middleware/uploadMiddleware");

const getAllData = async (req,res)=>{
    try{
        const controlPanel = await ControlPanel.find().sort({updatedAt: -1}).exec();
        res.json(controlPanel);
    }
    catch(err){
        return res.status(500).json({
            errors: {
                common: {
                    msg: `Unknown error occured ! ${err.message}`,
                }
            }
        })
    }
}

const addControlPanel = async (re,res)=>{
    try{
        const{title,status,banner} = req.body; 
        const newControlPanel = new ControlPanel({title,status,banner});
        if(req.file){
            cloudinary.uploader.upload(req.file.path, async(err,result)=>{
              if(err){
                console.log(err);
                throw new Error("Image upload failed");
              }
      
              newControlPanel.banner = result.secure_url; 
              newControlPanel.publicid = result.public_id;
      
              //save the question to the database 
              await newControlPanel.save(); 
      
              res.status(200).json({success:true, data: newControlPanel}); 
            });
          }else{
            await newControlPanel.save();
            res.status(200).json({success:true, data: newControlPanel});
          }
    }
    catch(err){
        res.status(500).json({success:false,error:err.message})
    }
}

// Update ControlPanel Api Controller 
const updateControlPanel = async(req,res,next)=>{
    try{
        const{title,status,banner} = req.body; 
        const {id} = req.params;
    
        // Find the category by ID 
        const controlpanel = await ControlPanel.findById(id); 
    
        if(!controlpanel){
          return res.status(404).json({success: false, error : "Home Settings not found"});
        }
        controlpanel.title = title; 
        controlpanel.status = status;    
        // Check if an image was uploaded 
        if(req.file){
          cloudinary.uploader.upload(req.file.path, async(err, result)=>{
            if(err){
              console.log(err); 
              throw new Error("Image uplaod failed"); 
            }
            controlpanel.banner = result.secure_url; 
            controlpanel.publicid = result.public_id; 
    
            await controlpanel.save();
            res.json({success: true, data: category}); 
          }); 
        }else{
          await controlpanel.save(); 
          res.json({success: true, data: controlpanel}); 
        }
    
      }
      catch(error){
        res.status(500).json({success: false, error: error.message});
      }
    
}

module.exports = {
    getAllData,
    addControlPanel,
    updateControlPanel

}