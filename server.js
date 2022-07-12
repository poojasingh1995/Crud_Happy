const Hapi = require('@hapi/hapi');
const mysql = require('mysql');
const environment = require('./knexfile');
const knex = require('knex')(environment['development']);

const init = async () => {
    const server = Hapi.server({
        port: 8000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path: '/create',
        handler: async(req, h) => {
            try {
                let data = await knex('happy_js').where({name:req.payload.name,email:req.payload.email,password:req.payload.password})
                // console.log(req.payload)     ///// instead of (req.body) we used (req.payload)
                if (data.length == 0){
                    await knex('happy_js').insert(req.payload)
                    return (`successfully data inserted `)
                }
                return ('your data is already exit, please try again')
                // console.log(data);
                // console.log(req.payload);
            } catch (error){
                return h.response(error.message)
            }
            count++
        }
    });

    //// Read particular data by id
    server.route({
        method: 'GET',
        path: '/path/{id}',
        handler: async(req, res) =>{
            try {
                const data = await knex('happy_js').where({id: req.params.id})
                return res.response(data)
            } catch (error) {
                return res.response(error)
            }
        }
    })

    server.route({
        method: 'PUT',
        path: '/update/{id}',
        handler: async (req, res) => {
            console.log(req.payload)

            try {
                console.log(req.payload);
                const data = await knex('happy_js').where ({id: req.params.id}).update (req.payload)
                return res.response('Your data updated')
            } catch (err) {
                return res.response(err)
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/delete/{id}',
        handler: async (req, h) => {
            try {
                const data = await knex('happy_js').where({id: req.params.id}).del(req.payload)
                return 'data deleted'
            } catch (err) {
                return err;   
            }
        }
    })

    await server.start();
    console.log('Server running on', server.info.uri);
}

init();