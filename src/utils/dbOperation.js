export const getOne = (model) => async(req, res) =>{
  try{
    const doc = await model.findById(req.params.name, 'name').lean().exec()
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
    try{
       const doc = await model.create(req.params)
       res.status(201).json({data:doc})
    }
    catch(e){
        console.log(e)
        res.status(400).end
    }
}

export const crudService = (model) => ({
    getOne : getOne(model),
    createOne : createOne(model)
})