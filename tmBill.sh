pkill -9 -f "node tmBill.js"
cd /var/www/wcomshop/kratos.w-shop.in
rm tmBillLog
nohup /usr/bin/node tmBill.js > tmBillLog 2>&1 &