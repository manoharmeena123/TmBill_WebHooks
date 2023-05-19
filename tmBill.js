//#region setup 
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  var exec = require("child_process").exec;
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.raw({limit: '50mb'}));
  var fs = require('fs');
  var request = require("request");
  var https = require("https");
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var httpBuildQuery = require('http-build-query');
  const queryString = require('query-string');
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/kratos.w-shop.in/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/kratos.w-shop.in/fullchain.pem', 'utf8'),
    rejectUnauthorized: false
  };
  const date = require('date-and-time');

  const mysql = require('mysql');
const e = require('express');
  var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'coriolanus.cif0oppvhlct.ap-south-1.rds.amazonaws.com',
    user            : 'databaseUser',
    password        : '@@DBUser51!!#',
  });

  var httpsServer = https.Server(options, app);
//#endregion

//#region variables
  var requests = [];
//#endregion

//#region functions
  function sendMessageToSlack(message)
  {
    message = JSON.stringify(message);
    var data = JSON.stringify({
      "text": message
    });
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        // console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "https://hooks.slack.com/services/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");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "09373859-ee66-7b22-29fd-970dc5006f4f");
    
    xhr.send(data);
  }

  function sendMessageToWhatsapp(messageBody,store)
  {
    /*var options = 
    {
      uri: `https://ourea.upsalesuite.com:8102/send/${store}`,
      body: messageBody,
      method: 'POST',
      headers: 
      {
        'Content-Type': 'application/json'
      }
    }
    request(options, function (error, response) 
    {
      let json = response.body;
    });*/
  }

  function getTime(timeDiff)
  {
    var today = new Date(Date.now() - (1000 * 60 * timeDiff));
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();
    var ss = today.getSeconds();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    if(hh<10) hh = '0'+hh;
    if(min<0) min = '0'+min;
    if(ss<0) ss = '0'+ss;

    let timeToReturn = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    return timeToReturn;
  }

  function pass(message,data=undefined)
  {
    let response = {};
    response.status = true;
    response.message = message;
    if(data == undefined)
    {
      data = [];
    }
    response.data = data;
    return JSON.stringify(response);
  }

  function fail(message,data=undefined)
  {
    let response = {};
    response.status = false;
    response.message = message;
    if(data == undefined)
    {
      data = [];
    }
    response.data = data;
    return JSON.stringify(response);
  }

  function createDump(dumpStr,orderIdVal,dumpType)
  {
    let sql = "insert into `tmbill`.`order_dump` (dump,orderId,dumpType) values(";
    sql+=`${pool.escape(dumpStr)},${orderIdVal},${dumpType})`;
    try 
    {
      pool.query(sql,(err,data)=>
      {
        //do nothing here
      });
    } 
    catch (error) 
    {

    }
  }

  async function getCustomer(phone,name)
  {
    let customerExists = false;
    let customerId = -1;
    let checkUserSql = "select id from `wcommerce`.`wusers` where contact='"+phone+"' limit 1";
    try 
    {
      let customer = await executeQuery(checkUserSql);
      customerId = customer[0].id;
      customerExists = true;
      return customerId;
    } 
    catch (error) 
    {
      customerExists = false;
    }
    let isql = "insert into `wcommerce`.`wusers` (name,countrycode,contact) values"+` (${pool.escape(name)},91,'${phone}');`;

    try
    {
      customerId = await insertGetId(isql);
      return customerId;
    }
    catch(error)
    {
      return -1;
    }
  }

  async function executeQuery(sql)
  {
    return new Promise((resolve,reject)=>
    {
      pool.query(sql,(err,data)=>
      {
        if(err)
        {
          return reject(err);
        }
        if(data.length && data.length>0)
        {
          return resolve(data);
        }
        else
        {
          return reject(new Error("No Rows Returned"));
        }
      });
    });
  }

  async function insertGetId(sql)
  {
    return new Promise((resolve,reject)=>
    {
      pool.query(sql,(err,data)=>
      {
        if(err)
        {
          return reject(err);
        }
        return resolve(data.insertId);
      });
    });
  }

  async function update(sql)
  {
    return new Promise((resolve,reject)=>
    {
      pool.query(sql,(err,data)=>
      {
        if(err)
        {
          return reject(err);
        }
        return resolve(data.affectedRows);
      });
    });
  }

  async function shortenUrl()
  {
    
  }

  function clearTable(store,table_no)
  {
    try 
    {
      var data = `store=${store}&table_no=${table_no}`;
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
  
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) 
        {

        }
      });
  
      xhr.open("POST", "https://store.washops.in/focus/clearTable");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(data);
    } 
    catch (error) 
    {
      // console.log(error);
    }
  }

  async function getOrderUrl(oid,sno)
  {
      return new Promise(resolve => 
        {
          try 
          {
            let datam = JSON.stringify(
            {
              "storeNumber": sno,
              "orderID": oid
            });

            var options = 
            {
              uri: 'https://webhook.w-shop.in/api/storefront/getStorefrontUrl',
              body: datam,
              method: 'POST',
              headers: 
              {
                'Content-Type': 'application/json'
              }
            }
            request(options, function (error, response) 
            {
              let json = response.body;
              if(json.status)
              {
                resolve(json.data);
              }
              else
              {
                resolve(`w-shop.in/orders/${oid}`);
              }
            });
          } 
          catch (error) 
          {
            return resolve(`w-shop.in/orders/${oid}`);
          }
      });
  }

  async function updateCatalogOrder(store,table,sendBill,orderJson,orderStatus,paymentMode)
  {
    return new Promise(resolve=>
    {
      try 
      {
        let datam = JSON.stringify(
        {
          "store": store,
          "table": table,
          "send_bill": sendBill,
          "order": orderJson,
          "status":orderStatus,
          "payment_mode": paymentMode
        });



        var url = "https://ordr.washops.in/cptain";
        if(orderStatus == "COMPLETE")
        {
          url+=`/complete_order`;
        }
        else if(orderStatus == "PAID")
        {
          // url+=`/markaspaid`;
          url+=`/complete_order`;
        }
        else
        {
          url+=`/rejected`;
        }

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Update Catalog Order !!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(`URL: ${url}`);
        console.log(datam);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! End Of Update Catalog Order !!!!!!!!!!!!!!!!!");

        var options = 
        {
          uri: url,
          body: datam,
          method: 'POST',
          headers: 
          {
            'Content-Type': 'application/json'
          }
        }
        request(options, function (error, response) 
        {
          let json = response.body;
        });
      } 
      catch (error) 
      {
        resolve("");
      }
    });
  }

//#endregion

//#region endpoints
    //Default Endpoint
    app.all('/', (req, res) => 
    {
      console.log("TMBill Application Running Boi");
      res.send("TMBill Application is Running");
    });

    //order update
    app.all("/order_updated",async (req,res,next)=>
    {
      res.setHeader('Content-Type', 'application/json');

      //#region  Variables
        let testson = req.body;

        var json = {};
        if(req.body.data!=undefined && req.body.data[0]!=undefined)
        {
          json = req.body.data[0];
        }
        else
        {
          json = req.body;
        }
        var store = 0;
        var storefront = 0;
        var storeObj = {};
        var order = undefined;
        let orderExists = false;
      //#endregion

      //#region Dump
        try 
        {
          createDump(JSON.stringify(json),json.order_id,"order_data");  
        } 
        catch (error) 
        {
 
        }
      //#endregion
      
      //#region Find Store
        try 
        {
          let storeSql = "select ws.name,ws.currency,ws.currency_symbol,st.store,ws.storefront,ws.contact from `tmbill`.`store_tokens` as st inner join `wcommerce`.`wstores` as ws on ws.store_no=st.store where storeId="+`'${json.store_id}' limit 1;`;
          let storeData = await executeQuery(storeSql);
          store = storeData[0].store;
          storefront = storeData[0].storefront;
          storeObj = storeData[0];
        } 
        catch (error) 
        {
          sendMessageToSlack(`Error Occured while searching store. `);
          return res.send(fail("Unable To Find Store"));
        }
      //#endregion

      if(String(store) == "100982")
      {
        console.log("----------------------- Order Update Json ---------------------------------------");
        console.log(JSON.stringify(json));
        console.log("----------------------- End OfOrder Update Json ---------------------------------");
      }

      //#region Search Existing Order
        try 
        {
          let orderSql = "select `id`,`order_id`,`hook_id`,`cust_id`,`cust_phone`,`status`,`price`,`tax`,`payment_status`,`payment_mode`,`order_type`,`table_no`,`data`,`customer_details`,`additionalCharges`,`note`,`user_note`,`fulfillment` from `wcommerce`.`worders` where ";
          orderSql+=`store_no=${store} and order_id='${json.order_id}' limit 1;`;
          try 
          {
            let orderData = await executeQuery(orderSql);
            order = orderData[0];
          } 
          catch (error) 
          {
            order = {};
          }

          try 
          {
            if(order.data)
            {
              order.data = JSON.parse(order.data);
              orderExists = true;
            }
            else
            {
              order.data = [];
            }
          } 
          catch (error) 
          {
            order.data = [];
          }
          

          if(order == undefined)
          {
            //new order bois
            order = {};
          }

          try 
          {
            if(order.additionalCharges)
            {
              order.additionalCharges = JSON.parse(order.additionalCharges);
            }
            else
            {
              order.additionalCharges = {};
            }
          } 
          catch (error) 
          {
            order.additionalCharges = {};
          }

          try 
          {
            order.customer_details = JSON.parse(order.customer_details);
          } 
          catch (error) 
          {
            order.customer_details = {};
            order.customer_details.countrycode = "91";
            if(json.phone)
            {
              order.customer_details.phone = json.phone;
              if(order.customer_details.phone.length>10)
              {
                order.customer_details.phone = order.customer_details.phone.substring(order.customer_details.phone.length - 10);
              }
            }
          }
        } 
        catch (error) 
        {
          orderExists = false;
          console.log(`Error Occured with searching Order.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
          console.log(error);
          sendMessageToSlack(`Error Occured with searching Order.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
        }
      //#endregion

      //#region Order Setup
        order.order_id = json.order_id;

        if(typeof order.hook_id==="undefined")
        {
          order.hook_id = -1;
        }
        
        //#region Customer Identification
          if(typeof order.cust_id === "undefined" || order.cust_id==0 )
          {
            order.cust_id = -1;
            try 
            {
              order.cust_id = await getCustomer(json.phone,json.cust_name);
            } 
            catch (error) 
            {
              // console.log(error);  
            }
          }
          else
          {
            //customer id exists, do nothing
          }
        //#endregion

        if(typeof order.cust_phone === "undefined")
        {
          order.cust_phone = json.phone;
        }

        if(typeof order.status === "undefined")
        {
          order.status  = "created";
        }

        // console.log("&&&&&&&&&&&&&&&&##################^^^^^^^^^^^^^^^^^^^^^^^^^");
        // console.log(json.order_state);
        // console.log("&&&&&&&&&&&&&&&&##################^^^^^^^^^^^^^^^^^^^^^^^^^");

        
        switch(json.order_state)
        {
          case "acknowledged":
            order.status  = "accepted";
            order.fulfillment = "Order Placed";

            let dataObj = {};
            let args = [];
            args.push(String(storeObj.name));
            let orderUpdateUrl = `https://webhook.w-shop.in/api/updateOrderGet/${order.order_id}`;

            // console.log(orderUpdateUrl);

            var ouuoptions = 
            {
              uri: orderUpdateUrl,
              method: 'GET',
              headers: 
              {
                'Content-Type': 'application/json'
              }
            }
            request(ouuoptions, function (error, response) 
            {
              // console.log(response.body);
            });

            let ourl= await getOrderUrl(order.order_id,store);

            args.push(String(ourl));
            args.push(String(storeObj.contact));
            dataObj.type = "template";
            dataObj.templateId = "orderfinal_01";
            dataObj.templateArgs = args;
            dataObj.sender_phone = order.customer_details.countrycode+order.customer_details.phone;

            let datum = 
            {
              "storeNumber":store,
              "customerId": order.cust_id,
              "data": JSON.stringify(dataObj),
              "requestType":"whatsappTemplateMessage",
              "purpose":"Order Accepted",
              "creditPurpose":"Delivery Order Accepted",
              "refference": order.id,
              "extra":"order_information",
              "exempt":false
            };

            var options = 
            {
              uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
              body: JSON.stringify(datum),
              method: 'POST',
              headers: 
              {
                'Content-Type': 'application/json'
              }
            }
            request(options, function (error, response) 
            {
              // console.log(response.body);
            });

          break;
          
          case "food ready":
            order.status  = "processing";
            order.fulfillment = "Preparing Food";

            if(order.order_type == "delivery")
            {
              let dataObj = {};
              let args = [];
              args.push(String(order.customer_details.first_name));
              args.push(String(order.order_id));
              args.push(String(storeObj.name));
              args.push("Out For Delivery");
              args.push(String(storeObj.contact));
              args.push("dummy");
              dataObj.type = "buttonTemplate";
              dataObj.templateId = "orderready_01";
              dataObj.templateArgs = args;
              dataObj.sender_phone = order.customer_details.countrycode+order.customer_details.phone;

              let datum =
              {
                "storeNumber":store,
                "customerId": order.cust_id,
                "data": JSON.stringify(dataObj),
                "requestType":"whatsappTemplateMessage",
                "purpose":"Order Ready",
                "creditPurpose":"Delivery Order Ready",
                "refference": order.id,
                "extra":"order_information",
                "exempt":false
              }

              var options = 
              {
                uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
                body: JSON.stringify(datum),
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json'
                }
              }
              request(options, function (error, response) 
              {
                // console.log(response.body);
              });
            }
            else if(order.order_type == "takeaway")
            {
              let dataObj = {};
              let args = [];
              args.push(String(order.customer_details.first_name));
              args.push(String(order.order_id));
              args.push(String(storeObj.name));
              args.push("Ready For Pickup");
              args.push(String(storeObj.contact));
              args.push("dummy");
              dataObj.type = "buttonTemplate";
              dataObj.templateId="orderready_01";
              dataObj.templateArgs = args;
              dataObj.sender_phone = order.customer_details.countrycode+order.customer_details.phone;

              let datum =  
              {
                "storeNumber":store,
                "customerId": order.cust_id,
                "data": JSON.stringify(dataObj),
                "requestType":"whatsappTemplateMessage",
                "purpose":"Order Ready",
                "creditPurpose":"Pickup Order Ready",
                "refference": order.id,
                "extra":"order_information",
                "exempt":false
              };

              var options = 
              {
                uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
                body: JSON.stringify(datum),
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json'
                }
              }
              request(options, function (error, response) 
              {
                // console.log(response.body);
              });
            }
          break;
          
          case "dispatched":
            order.status  = "completed";
            order.fulfillment = "Ready To Deliver";
            
            //deliver all products here
            let reqObj = {};
            reqObj.store = store;
            let iarr = [];
            reqObj.orderId = order.order_id;
            reqObj.cc = "91";
            reqObj.contact = order.cust_phone;
            reqObj.cid = order.cust_id;
            for(let i=0;i<order.data.length;i++)
            {
              try 
              {
                if(order.data[i].completed)
                {

                }
                else
                {
                  iarr.push(parseInt(order.data[i].id));
                }  
              } 
              catch (error) 
              {
                
              }
            }

            if(iarr.length>0)
            {
              reqObj.itemIds = iarr;
              var options = 
              {
                uri: 'https://webhook.w-shop.in/api/updateKDSOrder',
                body: JSON.stringify(reqObj),
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json'
                }
              }

              // console.log(options);

              request(options, function (error, response) 
              {
                // console.log(response.body);
              });
            }
            else
            {
              //do nothing
            }
          break;
          
          case "fulfilled":
            order.status  = "completed";
            order.fulfillment = "Delivered";
            if((order.order_type == "delivery" || order.order_type == "takeaway") && order.store_no && order.store_no && order.store_no.toString() != "101147")
            {
              let dataObj = {};
              let args = [];
              args.push(String(storeObj.name));
              args.push(String(order.customer_details.first_name));
              args.push(String(order.price));

              args.push("dummy");
              args.push("dummy");
              args.push("dummy");

              dataObj.type = "buttonTemplate";
              dataObj.templateId="orderdelivered_01";
              dataObj.templateArgs = args;
              dataObj.sender_phone = order.customer_details.countrycode+order.customer_details.phone;

              let datum =  
              {
                "storeNumber":store,
                "customerId": order.cust_id,
                "data": JSON.stringify(dataObj),
                "requestType":"whatsappTemplateMessage",
                "purpose":"Feedback Message",
                "creditPurpose":"Feedback Message",
                "refference": order.id,
                "extra":"order_information",
                "exempt":false
              };

              var options = 
              {
                uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
                body: JSON.stringify(datum),
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json'
                }
              }
              request(options, function (error, response) 
              {
                // console.log(response.body);
              });
            }
            else if(json.table_name && json.table_name.length>0)
            {
              //call the api here with completed thingy
              let paymentMode = "COD";
              if(json.order_payments && json.order_payments.length>1)
              {
                paymentMode  = json.order_payments[0].payment_option.toUpperCase();
              }

              if(store.toString()!="101147")
              {
                let dataObj = {};
                let args = [];
                args.push(storeObj.name);
                args.push("Dummy Bc");
                args.push("Dummy");
                args.push("Dummy");
                dataObj.type = "template";
                dataObj.templateId = "feedbackfinal_01";
                dataObj.templateArgs = args;
                dataObj.sender_phone = `${order.customer_details.countrycode}${order.customer_details.phone}`;

                let datum = 
                {
                  "storeNumber":store,
                  "customerId": order.cust_id,
                  "data": JSON.stringify(dataObj),
                  "requestType":"whatsappTemplateMessage",
                  "purpose":"Feedback Message",
                  "creditPurpose":"Feedback Message",
                  "refference": order.id,
                  "extra":"order_information",
                  "status": json.table_name,
                  "exempt":false
                };

                

                var options = 
                {
                  uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
                  body: JSON.stringify(datum),
                  method: 'POST',
                  headers: 
                  {
                    'Content-Type': 'application/json'
                  }
                }

                request(options, function (error, response) 
                {

                });
              }


              await updateCatalogOrder(store,json.table_name,1,json,"PAID",paymentMode);


            }
          break;
          
          case "pending":
            order.status  = "created";
            order.fulfillment = "Order Placed";

            //call the api here with 
            let paymentMode = "COD";
            if(json.order_payments && json.order_payments.length>1)
            {
              paymentMode  = json.order_payments[0].payment_option.toUpperCase();
            }

            await updateCatalogOrder(store,json.table_name,1,json,"COMPLETE",paymentMode);
            
          break;
          
          case "cancelled":
            order.status = "rejected";
            order.fulfillment = "Rejected";
            if(order.order_type == "delivery" || order.order_type == "takeaway")
            {
              let dataObj = {};
              let args = [];
              args.push(String(storeObj.name));
              args.push(String(order.order_id));
              args.push(String(storeObj.contact));

              dataObj.type = "buttonTemplate";
              dataObj.templateId="order_rejected_01";
              dataObj.templateArgs = args;
              dataObj.sender_phone = order.customer_details.countrycode+order.customer_details.phone;

              let datum =  
              {
                "storeNumber":store,
                "customerId": order.cust_id,
                "data": JSON.stringify(dataObj),
                "requestType":"whatsappTemplateMessage",
                "purpose":"Order Rejected",
                "creditPurpose":"Order Rejected",
                "refference": order.id,
                "extra":"order_information",
                "exempt":false
              };

              console.log(datum);

              var options = 
              {
                uri: 'https://webhook.w-shop.in/api/initiateCreditCalculator',
                body: JSON.stringify(datum),
                method: 'POST',
                headers: 
                {
                  'Content-Type': 'application/json'
                }
              }
              request(options, function (error, response) 
              {
                // console.log(response.body);
              });
            }
          break;
          default:
            order.status  = "created";
            order.fulfillment = "Order Placed";
          break;
        }



        order.store_no = store;
        order.price = json.order_total;
        order.tax = json.order_level_total_taxes;
        if(typeof order.payment_status === "undefined")
        {
          order.payment_status = 0;
          order.payment_mode = "cash";
        }

        if(json.order_payments != undefined && json.order_payments.length>0)
        {
          order.payment_status  = 2;
          order.payment_mode = json.order_payments[0].payment_option.toLowerCase();
        }

        //#region Payment Link
          if(json.billing_type == 1 && order.status != "completed")
          {
            // let msg = "Hi, Thank you for ordering with us!. \n";
            // let payLink = `View Bill: https://backoffice.tmbill.in/ebill/${json.order_id} `;

            // // let shortLink = await 

            // msg += payLink;

            
            // let d = {};
            // d.type = "session";
            // d.purpose = "kot_update";
            // d.message_body= {};
            // d.message_body.type = "text";
            // d.message_body.message = msg;
            // d.message_body.caption = "text";
            // d.message_body.sender_phone = "91"+json.phone;
            // d.message_body.purpose = "kot_update";
            // sendMessageToWhatsapp(JSON.stringify(d),store);
          }
        //#endregion

        //#region Table Closing
          if(json.billing_type == 1 && order.status == "completed")
          {
            //identify table and clear relevant tables
            let tableSql = "select hook_id from `wcommerce`.`worders` where `store_no`="+store+" and `table_no`='"+json.table_name
            +"' and order_type='dine_in' and doc>'"+getTime(180)+"' limit 1";
            try 
            {
              let tableHook = await executeQuery(tableSql);
              let tableUpdateSql = "update `wcommerce`.`worders` set `payment_status`='2', `status`='completed' where `hook_id`="+tableHook[0].hook_id;
              try 
              {
                let tableUpdateStatus = await update(tableUpdateSql);
              } 
              catch (error) 
              {
                // console.log(error);
              }
            } 
            catch (error) 
            {
              console.log(error);
            }

            //#region Table Clearing
              try 
              {
                clearTable(store,order.table_no);
              } 
              catch (error) 
              {
                // console.log(error);  
              }
            //#endregion
          }
        //#endregion

        order.table_no = json.table_name;
        if(typeof order.order_type === "undefined")
        {
          order.order_type = "takeaway";
          switch(json.billing_type)
          {
            case 0:
              order.order_type = "tmbill_quickBill";
            break;
            case 1:
              order.order_type = "tmbill_dineIn";
            break;
            case 2:
              order.order_type = "tmbill_takeaway";
            break;
            case 3:
              order.order_type = "tmbill_delivery";
            break;
            case 4:
              order.order_type = "tmbill_zomato";
            break;
            case 5:
              order.order_type = "tmbill_swiggy";
            break;
            case 6:
              order.order_type = "tmbill_uberEats";
            break;
            case 7:
              order.order_type = "tmbill_dunzo";
            break;
            case 8:
              order.order_type = "tmbill_digitalOrder";
            break;
            case 40:
              order.order_type = "upsale";
            break;
          }
        }


        let itemStartIndex = 0;
        if(typeof order.data === "undefined")
        {
          order.data = [];
          itemStartIndex = 0;
        }
        else
        {
          //compare and add items
          if(order.data.length>=json.order_items.length)
          {
            //do nothing
            itemStartIndex = json.order_items.length;
          }
          else
          {
            itemStartIndex = order.data.length;
          }
        }
        for (let i = itemStartIndex; i < json.order_items.length; i++) 
        {
          let d = json.order_items[i];
          let oi = {};
          oi.id = d.item_id;
          oi.product = oi.id;
          oi.name = d.title;
          oi.variations = [];
          oi.quantity = d.quantity;
          oi.weight = 0;
          oi.variation_id = 0;
          oi.subtotal = d.total;
          oi.subtotal_tax = 0;
          oi.total = d.total_with_tax;
          oi.total_tax = 0;
          oi.taxes = [];
          oi.price = d.price;
          oi.productId = oi.id;
          oi.timestamp = new Date();
          oi.cancelled = false;
          order.data.push(oi);
        }

        //#region TMBill Items Matching
          let tmbillOrderIds = [];
          for(let i=0;i<order.data.length;i++)
          {
            if(tmbillOrderIds.includes(order.data[i].id))
            {

            }
            else
            {
              tmbillOrderIds.push(order.data[i].id);
            }
          }
          if(tmbillOrderIds.length>0)
          {
            //get existing tmbill item ids update the product
            let tmBillItemsSql = "select item_id,internal_id  from `tmbill`.`tmbill_products` where"+` storefront=${storefront} and item_id in (${tmbillOrderIds.join(",")});`;
            // console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
            // console.log(tmBillItemsSql);
            // console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
            try 
            {
              let tmBillItems = await executeQuery(tmBillItemsSql);
              for(let i=0;i<tmBillItems.length;i++)
              {
                for (let j = 0; j < order.data.length; j++) 
                {
                  //check if the item it matched the tmbill item id
                  if(order.data[j].id == tmBillItems[i].item_id)
                  {
                    //matched
                    order.data[j].id = tmBillItems[i].internal_id;
                    order.data[j].product = tmBillItems[i].internal_id;
                    order.data[j].productId = tmBillItems[i].internal_id;
                    break;
                  }
                }
              }
            } 
            catch (error) 
            {
              // console.log(error);
            }

            try 
            {
              let tmbillProductIds = [];
              for(let i=0;i<order.data.length;i++)  
              {
                if(tmbillProductIds.includes(order.data[i].id))
                {

                }
                else
                {
                  tmbillProductIds.push(order.data[i].id);
                }
              }

              // console.log(JSON.stringify(tmbillProductIds));

              if(tmbillProductIds.length>0)
              {
                let upsaleItemSql = "select `category`,`subcategory`,`item` from `wcommerce-menus`.`store_items_assoc` where storefront="+storefront+` and item in (${tmbillProductIds.join(",")})`;
                try 
                {
                  let assocResult = await executeQuery(upsaleItemSql);
                  for (let i = 0; i < order.data.length; i++) 
                  {
                    order.data[i].categories = [];
                    order.data[i].subcategories = [];

                    for(let j=0;j<assocResult.length;j++)
                    {
                      let d = assocResult[j];
                      if(d.item == order.data[i].id)
                      {
                        if(d.category)
                        {
                          let cat = {};
                          cat.id = d.category;
                          order.data[i].categories.push(cat);
                        }
                        if(d.subcategory)
                        {
                          let subcat = {};
                          subcat.id = d.subcategory;
                          order.data[i].subcategories.push(subcat);
                        }
                      }
                    }
                  }
                } 
                catch (error) 
                {
                  // console.log(error);
                }
              }

            } 
            catch (error) 
            {
              // console.log(error);
            }
          }
        //#endregion

        if(typeof order.customer_details === "undefined")
        {
          order.customer_details = {};
          let d = {};
          d.first_name = "";
          d.last_name = "";
          d.company = "";
          d.address_1 = "";
          d.address_2 = "";
          d.city = "";
          d.state = "";
          d.postcode = "";
          d.country = "";
          d.email = "";
          d.phone = "";
          d.countrycode = "";
          order.customer_details = d;
        }

        order.customer_details.first_name = json.cust_name;
        order.customer_details.address_1 = json.line_1;
        order.customer_details.address_2 = json.line_2;
        order.customer_details.phone = json.phone;

        if(typeof order.additionalCharges === "undefined")
        {
          order.additionalCharges = {};
          let d = {};
          d.discount = json.order_level_discount;
          d.additionalChargeAmount = 0;
          d.additionalChargeName = 0;
          d.discount_note = "";
          order.additionalCharges = d;
        }

        order.note = "";
        if(typeof order.user_note === "undefined")
        {
          order.user_note = "";
        }
        order.user_note = json.instructions;

        order.shippingProvider = "tmbill";
      //#endregion

      //#region Order Insertion/ Updation

        if(orderExists != true)
        {
          //insert order
          let isql = "insert into `wcommerce`.`worders` (`order_id`,`hook_id`,`cust_id`,`cust_phone`,`status`,`store_no`,`price`,`tax`,`payment_status`,`payment_mode`,`order_type`,`table_no`,`data`,`customer_details`,`additionalCharges`,`note`,`user_note`,`shippingProvider`) values";
          isql+=` ('${order.order_id}',${order.hook_id},${order.cust_id},'${order.cust_phone}','${order.status}',${order.store_no},${order.price},${order.tax},'${order.payment_status}','${order.payment_mode}','${order.order_type}','${order.table_no}',${pool.escape(JSON.stringify(order.data))},${pool.escape(JSON.stringify(order.customer_details))},${pool.escape(JSON.stringify(order.additionalCharges))},${pool.escape(order.note)},${pool.escape(order.user_note)},${pool.escape(order.shippingProvider)});`;

          try 
          {
            let insertId = await insertGetId(isql);
            if(insertId!=undefined && parseInt(insertId)>0)
            {
              //#region Bill Check
                // if(order.cust_id>0)
                // {
                //   let d = {};
                //   d.type = "template";
                //   d.purpose="bill_update";
                //   d.message_body = {};
                //   d.message_body.type = "template";
                //   d.message_body.templateId = "bill_alert_notify";
                //   d.message_body.templateLanguage ="en";
                //   let args = [];
                //   args.push(storeObj.name);
                //   args.push(`${storeObj.currency_symbol} ${order.price}`);
                //   args.push("dummy");
                //   args.push(encodeURI("https://backoffice.tmbill.in/ebill/"+json.order_id));
                //   d.message_body.templateArgs = args;
                //   d.message_body.sender_phone = "91"+order.cust_phone;
                //   d.message_body.purpose = "bill_update";
                //   sendMessageToWhatsapp(JSON.stringify(d),order.store_no);
                // }
              //#endregion

              //#region Bill Integration
                if(order.cust_id>0)
                {
                  let d = {};
                  d.type = "template";
                  d.purpose="bill_update";
                  d.message_body = {};
                  d.message_body.type = "template";
                  d.message_body.templateId = "bill_alert_notify";
                  d.message_body.templateLanguage ="en";
                  let args = [];
                  args.push(storeObj.name);
                  args.push(`${storeObj.currency_symbol} ${order.price}`);
                  args.push("dummy");
                  args.push(encodeURI("https://backoffice.tmbill.in/ebill/"+json.order_id));
                  d.message_body.templateArgs = args;
                  d.message_body.sender_phone = "91"+order.cust_phone;
                  d.message_body.purpose = "bill_update";
                  sendMessageToWhatsapp(JSON.stringify(d),order.store_no);
                }
              //#endregion

              //#region Points Check
                // let psql = "select amountValue,pointValue from `wcommerce`.`store_settings` where store_no ="+order.store_no+" limit 1";
                // console.log(psql);
                // try 
                // {
                //   let pres = await executeQuery(psql);
                //   if(pres)
                //   {
                //     let upi = pres[0].amountValue;
                //     let upiPoints = pres[0].pointValue;

                //     let points = 0;
                //     let pointsmode = "";

                //     points = parseInt(parseInt(order.price) / parseInt(upi));
                //     points = points * parseInt(upiPoints);
              
                    
                //     console.log(pres);
                //     console.log(`POINT: ${points}`);

                //     if(points>0)
                //     {
                //       let pointsId = -1;
                //       let checkpointsql = "select id from `wcommerce`.`wcustomer_points` where cust_id="+order.cust_id+" and store_no="+order.store_no;
                //       try 
                //       {
                //         let pres = await executeQuery(checkpointsql);
                //         pointsId = pres[0].id;
                //       } 
                //       catch (error) 
                //       {
                //         //records do not exist
                //         try 
                //         {
                //           let insertPointsSql = "insert into `wcommerce`.`wcustomer_points` (cust_id,store_no) values("+`${order.cust_id},${order.store_no}`+")";
                //           pointsId = await insertGetId(insertPointsSql);
                //         } 
                //         catch (error) 
                //         {
                //           console.log(error);
                //         }
                //       }

                //       if(pointsId>-1)
                //       {
                //         let upsql = "update `wcommerce`.`wcustomer_points` set `points`=(`points` + "+points+"), `totalpoints`=(`totalpoints`+"+points+") where id="+pointsId;
                //         console.log(upsql);
                //         try 
                //         {
                //           let affectedRows = await update(upsql);
                //           if(affectedRows>0)
                //           {
                //             //create points history
                //             let wcph_sql = "insert into `wcommerce`.`wcustomer_points_history` (cust_id,store_no,point,amount,offer_id) values(";
                //             wcph_sql+=`${order.cust_id},${order.store_no},${points},${order.price},0)`;
                //             try 
                //             {
                //               let wcph_res = await insertGetId(wcph_sql);
                //               console.log(wcph_res);
                //             } 
                //             catch (error) 
                //             {
                //               console.log(error)  ;
                //             }
                //           }
                //         } 
                //         catch (error) 
                //         {
                //           console.log("Unable To Add Points");
                //           console.log(error);
                //         }
                //       }
                      
                //     }

                //   }
                //   else
                //   {
                //     console.log("Invalid Store Points");
                //   }
                // } 
                // catch (error) 
                // {
                //   console.log(error);
                // }
              //#endregion
              
              res.end(pass("New Order Added"));
            }
            else
            {
              res.end(fail("Unable To Add order"));
            }
          } 
          catch (error) 
          {
            // console.log(error);
            res.end(fail("Unable To Add order"));
          }
        }
        else
        {
          //update order
          let usql  = "update `wcommerce`.`worders` set `status`='"+order.status+"', `price`="+order.price+", `tax`="+order.tax
          +", `payment_status`='"+order.payment_status+"', `data`="+`${pool.escape(JSON.stringify(order.data))}`+", `customer_details`="
          +`${pool.escape(JSON.stringify(order.customer_details))}`+", `additionalCharges`="+`${pool.escape(JSON.stringify(order.additionalCharges))}`+", `shippingProvider`='"+order.shippingProvider+"' where `order_id`='"+order.order_id+"' limit 1;";
          
          // console.log(usql);


          try 
          {
            let updateStatus = await update(usql);
            if(updateStatus>0)
            {
              res.end(pass("Order Updated"));
            }
            else
            {
              res.end(fail("Unable To Update order"));
            }
          } 
          catch (error) 
          {
            // console.log(error);
            res.end(fail("Unable To Update order"));
          }
        }
      //#endregion
    });

    //kot updated
    app.all("/kot_updated",async(req,res,next)=>
    {

      res.setHeader('Content-Type', 'application/json');

      //#region  Variables
        var json = req.body.data;
        var store = 0;
        let pulled = 0;
      //#endregion


      pulled = json.pulled;
      if(pulled == 0)
      {
        res.end(fail("Nothing To Do Here"));
        return;
      }
      
      //#region Dump
        try 
        {
          createDump(JSON.stringify(json),json.order_id,"kot_data");
        } 
        catch (error) 
        {
          // console.log(error);  
        }
      //#endregion
      
      //#region Find Store
        try 
        {
          let storeSql = "select st.store,ws.storefront from `tmbill`.`store_tokens` as st inner join `wcommerce`.`wstores` as ws on ws.store_no=st.store where storeId="+`'${json.store_id}' limit 1;`;
          let storeData = await executeQuery(storeSql);
          store = storeData[0].store;
          storefront = storeData[0].storefront;
        } 
        catch (error) 
        {
          sendMessageToSlack(`Error Occured while searching store.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
          return res.send(fail("Unable To Find Store"));
        }
      //#endregion

      if(String(store) == "100982")
      {
        console.log("--------------------------------- KOT Update ------------------------------------------");
        console.log(JSON.stringify(json));
        console.log("--------------------------------- End Of KOT Update -----------------------------------");
      }
      
      //#region Update Pending
        if(pulled>0)
        {
          let updateSql = "update `tmbill`.`tmbill_orderPush` set `processed`=1 where `store`="+store+" and `kot_id`='"+json.remote_kot_id+"' limit 1";
          try 
          {
            let updateStatus = await update(updateSql);
            if(updateStatus>0)
            {

            }
            else
            {
              sendMessageToSlack(`${json.order_id}: Unable To Update Status`);
            }
          } 
          catch (error) 
          {

          }
        }
      //#endregion

      //#region Send Message
        let msg = "";
        if(pulled == 1)
        {
          msg = `*Your order has been accepted*. \n`;
        }
        else
        {
          msg = `*Your order has been rejected*. \n`;
          //#region Update Catelog Order
            if(json.table_name && json.table_name.length>0)
            {
              await updateCatalogOrder(store,json.table_name,0,json,"REJECTED","");
            }
            
          //#endregion
        }

        msg+="Item Summary: \n";
        for(let i =0;i<json.payload.order_items.length;i++)
        {
          let d = json.payload.order_items[i];
          msg+=`${d["quantity"]} x ${d["title"]} \n`;
        }

        let d = {};
        d.type = "session";
        d.purpose = "kot_update";
        d.message_body= {};
        d.message_body.type = "text";
        d.message_body.message = msg;
        d.message_body.caption = "text";
        d.message_body.sender_phone = "91"+json.customer_phone;
        d.message_body.purpose = "kot_update";

        sendMessageToWhatsapp(JSON.stringify(d),store);
      //#endregion

      res.end(pass("Request Processed"));
      return;
    });

    //menu updated
    app.all("/menu_updated",async(req,res,next)=>
    {
      res.setHeader('Content-Type', 'application/json');
      let json = req.body;
      let store = 0;

      //#region Find Store
        try 
        {
          let storeSql = "select st.store,ws.storefront from `tmbill`.`store_tokens` as st inner join `wcommerce`.`wstores` as ws on ws.store_no=st.store where storeId="+`'${json.store_id}' limit 1;`;
          
          let storeData = await executeQuery(storeSql);
          store = storeData[0].store;
          storefront = storeData[0].storefront;
        } 
        catch (error) 
        {
          sendMessageToSlack(`Error Occured while searching store.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
          return res.send(fail("Unable To Find Store"));
        }
      //#endregion

      let sql = "insert into `tmbill`.`dump` (datum,store) values ("+pool.escape(JSON.stringify(json))+","+store+")";
      try 
      {
        let insertStatus = await insertGetId(sql);
        if(insertStatus!=undefined && parseInt(insertStatus)>0)
        {
          return res.send(pass("Request Received"));
        }
        else
        {
          return res.send(fail("Unable to Insert Record"));
        }
      } 
      catch (error) 
      {
        return res.send(fail("Unable to Insert Record, Error Occurred"));
      }
    });

    //option updated
    app.all("/option_updated",async(req,res,next)=>{
      res.setHeader('Content-Type', 'application/json');
      let json = req.body;
      let store = 0;

      //#region Find Store
        try 
        {
          let storeSql = "select st.store,ws.storefront from `tmbill`.`store_tokens` as st inner join `wcommerce`.`wstores` as ws on ws.store_no=st.store where storeId="+`'${json.store_id}' limit 1;`;
          
          let storeData = await executeQuery(storeSql);
          store = storeData[0].store;
          storefront = storeData[0].storefront;
        } 
        catch (error) 
        {
          sendMessageToSlack(`Error Occured while searching store.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
          return res.send(fail("Unable To Find Store"));
        }
      //#endregion

      let sql = "insert into `tmbill`.`dump_menu` (datum,store) values ("+pool.escape(JSON.stringify(json))+","+store+")";
      try 
      {
        let insertStatus = await insertGetId(sql);
        if(insertStatus!=undefined && parseInt(insertStatus)>0)
        {
          return res.send(pass("Request Received"));
        }
        else
        {
          return res.send(fail("Unable to Insert Record"));
        }
      } 
      catch (error) 
      {
        return res.send(fail("Unable to Insert Record, Error Occurred"));
      }
    });


//#endregion

//Start Listening
httpsServer.listen(process.env.PORT || 8101,  "0.0.0.0", function() {
  var host = httpsServer.address().address
  var port = httpsServer.address().port
});


//###################################################Backup 
    //   //#region  Variables
    //   var json = req.body;
    //   var store = 0;
    //   let storefront = 0;

    //   let tmBillGroups = [];
    //   let tmBillCategories = [];
    //   let tmBillProducts = [];
    //   let tmBillOptionGroups = [];
    //   let tmBillOptions = [];
    // //#endregion

    // //#region Dump
    //   try 
    //   {
    //     createDump(JSON.stringify(json),json.order_id,"menu_update");
    //   } 
    //   catch (error) 
    //   {
    //     console.log(error);  
    //   }
    // //#endregion

    // //#region Find Store
    //   try 
    //   {
    //     let storeSql = "select st.store,ws.storefront from `tmbill`.`store_tokens` as st inner join `wcommerce`.`wstores` as ws on ws.store_no=st.store where storeId="+`'${json.store_id}' limit 1;`;
    //     let storeData = await executeQuery(storeSql);
    //     store = storeData[0].store;
    //     storefront = storeData[0].storefront;
    //   } 
    //   catch (error) 
    //   {
    //     console.log(`Error Occured while searching store.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
    //     console.log(error);
    //     sendMessageToSlack(`Error Occured while searching store.\n_Store Id: ${json.store_id} \n_Order Id: ${json.order_id} `);
    //     return res.send(fail("Unable To Find Store"));
    //   }
    // //#endregion

    // //#region Initial Loads
    //   //#region Load Groups
    //     let tmbill_group_sql = "select * from `tmbill`.`tmbill_groups` where storefront="+storefront;
    //     try 
    //     {
    //       tmBillGroups = await executeQuery(tmbill_group_sql);
    //     } 
    //     catch (error) 
    //     {
    //       tmBillGroups = [];
    //       console.log(error);
    //     }
    //   //#endregion

    //   //#region Load Categories
    //     let tmbill_categories_sql  = "select * from `tmbill`.`tmbill_categories` where storefront="+storefront;
    //     try 
    //     {
    //       tmBillCategories  = executeQuery(tmbill_categories_sql);
    //     } 
    //     catch (error) 
    //     {
    //       tmBillCategories = [];
    //       console.log(error);
    //     }
    //   //#endregion

    //   //#region Load Products
    //     let tmbill_product_sql = "select * from `tmbill`.`tmbill_products` where storefront="+storefront;
    //     try 
    //     {
    //       tmBillProducts = executeQuery(tmbill_product_sql);
    //     } 
    //     catch (error) 
    //     {
    //       tmBillProducts = [];
    //       console.log(error);
    //     }
    //   //#endregion

    //   //#region Load Options Group
    //     let tmbill_options_group_sql = "select * from `tmbill`.`tmbill_options_group` where storefront="+storefront;
    //     try 
    //     {
    //       tmBillOptionGroups = executeQuery(tmbill_options_group_sql);
    //     } 
    //     catch (error) 
    //     {
    //       tmBillOptionGroups = [];
    //       console.log(error);
    //     }
    //   //#endregion
      
    //   //#region Load Options
    //   let tmbill_options_sql = "select * from `tmbill`.`tmbill_options` where storefront="+storefront;
    //   try 
    //   {
    //     tmBillOptions = executeQuery(tmbill_options_sql);
    //   } 
    //   catch (error) 
    //   {
    //     tmBillOptions = [];
    //     console.log(error);
    //   }
    // //#endregion
    // //#endregion
    
    // //#region Processing
    //   //#region Process Groups
    //     if(typeof json.product_groups === "undefined" || json.product_groups.length<=0)
    //     {
    //       //do nothing, no product groups to process
    //     }
    //     else
    //     { 
    //       let groupsToCreate = [];
    //       let jsonGroups = json.product_groups;
    //       for(let i=0;i<jsonGroups.length;i++)
    //       {
    //         let grp = jsonGroups[i];
    //         let groupMatched = false;
    //         for (let j = 0; j < tmBillGroups.length; j++) 
    //         {
    //           if(grp["id"] == tmBillGroups[j].group_id)
    //           {
    //             //matched here
    //             groupMatched = true;
    //             let updateGroupSql = "update `tmbill`.`tmbill_groups` set `title`='"+pool.escape(tmBillGroups[j].title)+"' where id="+tmBillGroups[j].id;
    //             try 
    //             {
    //               groupUpdateStatus = await update(updateGroupSql);
    //             } 
    //             catch (error) 
    //             {
    //               console.log(error);
    //             }
    //             break;
    //           }
    //         }
    //         if(groupMatched == false)
    //         {
    //           //create here
    //           let groupToCreate = {};
    //           groupToCreate.group_id = grp["id"];
    //           groupToCreate.title = grp["product_group_name"];
    //           groupToCreate.storefront = storefront;
    //           groupsToCreate.push(groupToCreate);
    //         }
    //       }

    //       if(groupsToCreate.length>0)
    //       {
    //         let groupsInsertSql = "insert into `tmbill`.`tmbill_groups` (group_id,title,storefront) values ";
    //         for (let i = 0; i < groupsToCreate.length; i++) 
    //         {
    //           groupsInsertSql+=`(${groupsToCreate[i].group_id},${pool.escape(groupsToCreate[i].title)},${storefront})`;
    //           if(i!=groupsToCreate.length-1)
    //           {
    //             groupsInsertSql+=",";
    //           }
    //         }
    //         console.log(groupsInsertSql);

    //         try 
    //         {
    //           let insertStatus = await insertGetId(groupsInsertSql);
    //           console.log(insertStatus);
    //         } 
    //         catch (error) 
    //         {
    //           console.log(error);
    //         }
            
    //       }
    //     }
    //   //#endregion
    
    //   //#region Process Categories
    //     if(typeof json.category_list === "undefined" || json.category_list.length<0)
    //     {
    //       //do nothing
    //     }
    //     else
    //     {
    //       let categoriesToCreate = [];
    //       let jsonCats = json.category_list;
    //       for(let i=0;i<jsonCats.length;i++)
    //       {
    //         let cat = jsonCats[i];
    //         if(cat["parent_ref_id"] == 0)
    //         {
    //           let categoryMatched = false;
    //           for(let j=0;j<tmBillCategories.length;j++)
    //           {
    //             if(cat["category_refid"] == tmBillCategories[j].tmbill_catid)
    //             {
    //               //matched 
    //               categoryMatched  = true;
    //               //update here
    //               let catUpdateSql = "update `tmbill`.`tmbill_categories` set `title`='"+pool.escape(cat["category_name"])+"' where tmbill_catid="+cat["category_refid"]+" limit 1";
    //               console.log(catUpdateSql);
    //               break;
    //             }
    //           }
    //           if(categoryMatched == false)
    //           {
    //             //create category first
                
    //           }
    //         }
    //       }
    //     }
    //   //#endregion

    // //#endregion
