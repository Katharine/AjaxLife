let pem = require('pem');
let http2 = require ('http2');
let proxy = require('http-proxy');


pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
  http2.createServer({key: keys.serviceKey, cert: keys.certificate}, function(req, res){
    proxy.createProxyServer().web(req, res, {target: 'http://localhost:8080'});
  }).listen(8081);
});
