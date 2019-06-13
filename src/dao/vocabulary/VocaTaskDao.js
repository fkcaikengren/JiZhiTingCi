



async function vocaTasks(params) {
    Http.get('/vocaTask/getVocaTasks')
    .then(response =>{
        return response.data.data
    })
}


//1. 保存任务列表
export const saveVocaTasks = (vocaTasks)=>{

    //虚拟数据
    
    let data = [
        {
            taskOrder: 1, //复习
            status: 22,
            playDuration: 180,
            vocaTaskDate: 1559378082410,
            words: [{
                word: "abandon",
                passed: false,
                wrongNum: 0
            },{
                word: "abort",
                passed: false,
                wrongNum: 0
            },{
                word: "pick",
                passed: false,
                wrongNum: 0
            },{
                word: "dish",
                passed: false,
                wrongNum: 0
            },{
                word: "miss",
                passed: false,
                wrongNum: 0
            },{
                word: "bolish",
                passed: false,
                wrongNum: 0
            },{
                word: "limit",
                passed: false,
                wrongNum: 0
            },{
                word: "join",
                passed: false,
                wrongNum: 0
            },{
                word: "sister",
                passed: false,
                wrongNum: 0
            },{
                word: "desk",
                passed: false,
                wrongNum: 0
            },{
                word: "monster",
                passed: false,
                wrongNum: 0
            },
            ]
        },
        {
            taskOrder: 2, //新学
            status: 10,
            playDuration: 180,
            vocaTaskDate: 1559378082410,
            words: [{
                word: "abandon",
                passed: false,
                wrongNum: 0
            },{
                word: "abort",
                passed: false,
                wrongNum: 0
            },{
                word: "pick",
                passed: false,
                wrongNum: 0
            },{
                word: "dish",
                passed: false,
                wrongNum: 0
            },{
                word: "miss",
                passed: false,
                wrongNum: 0
            },{
                word: "bolish",
                passed: false,
                wrongNum: 0
            },{
                word: "limit",
                passed: false,
                wrongNum: 0
            },{
                word: "join",
                passed: false,
                wrongNum: 0
            },{
                word: "sister",
                passed: false,
                wrongNum: 0
            },{
                word: "desk",
                passed: false,
                wrongNum: 0
            },{
                word: "monster",
                passed: false,
                wrongNum: 0
            }
            ],
          
        },
    ];
    for(let task of data){
        Storage.save({
            key: 'vocaTasks',
            id: task.taskOrder,
            data: task,
            expires: 1000 * 36000, //保存10h
        })
    }
}


//2. 加载任务列表
export const loadVocaTasks = ()=>{
    return new Promise((resolve, reject) => {
        Storage.sync = {
            // sync方法的名字必须和所存数据的key完全相同
            // 方法接受的参数为一整个object，所有参数从object中解构取出
            // 这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
            vocaTasks
        }
    
        Storage.load({
            key: 'vocaTasks',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            autoSync: true, 
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            syncInBackground: true,
            // 你还可以给sync方法传递额外的参数
            syncParams: {
            extraFetchOptions: {
                // 各种参数
            },
            someFlag: true,
            },
        })
        .then(vocaTasks => {     
            //保存数据到Storage
            saveVocaTasks(vocaTasks)
            //返回结果promise
            resolve(vocaTasks);
        })
        .catch(err => {
            console.warn(err.message);
            switch (err.name) {
            case 'NotFoundError':
                // 数据没找到，重新请求任务列表数据，
                break;
            case 'ExpiredError':
                // 数据过期，重新请求任务列表数据，
                break;
            }
            reject(err)
        });
        
    });
}


//3. 加载任务
export const loadTask = (taskOrder)=>{
    return new Promise((resolve, reject)=>{

        console.log('taskOrder:'+taskOrder);
        Storage.sync = {} //如果没有，不会网络请求获取任务
        Storage.load({
            key:'vocaTasks',
            id:taskOrder,
            autoSync: false, 
            syncInBackground:false,
        })
        .then(task=>{
            console.log(task);
            return resolve(task)
        })
        .catch(err=>{
            console.log('VocaTaskDao: 加载任务失败')
            console.warn(err.message);
            switch (err.name) {
            case 'NotFoundError':
                // 数据没找到，重新请求任务列表数据，
                loadVocaTasks();
                break;
            case 'ExpiredError':
                // 数据过期，重新请求任务列表数据，
                loadVocaTasks();
                break;
            }
            reject(err)
        })
    })
}


