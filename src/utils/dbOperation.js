export const getOne = (model) => async(req, res) =>{
  try{
    const doc = await model
    .findOne({ createdBy: req.user._id, _id: req.params.id })
    .lean()
    .exec()

    if(!doc){
        return res.status(400).end
    }
    res.status(200).json({data:doc})
  }
  catch(e){
    console.log(e)
    res.status(400).end()
  }
}

export const getAll = (model) => async (req, res) => {
    try{
      
        const doc = await model
        .findOne({ created_by: req.user._id })
        .lean()
        .exec()
       
    
        if(!doc){
            return res.status(400).end
        }
        res.status(200).json({data:doc})
      }
      catch(e){
        console.log(e)
        res.status(400).end()
      }
}

export const createOne = (model) => async(req,res) => {
    const created_by = req.user._id
    try{
       const doc = await model.create({...req.body, created_by})
       res.status(201).json({data:doc})
    }
    catch(e){
        console.log(e)
        res.status(400).end
    }
}

export const crudService = (model) => ({
    getOne : getOne(model),
    getAll: getAll(model),
    createOne : createOne(model)
})