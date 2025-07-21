#!/bin/bash
sleep 10

mongosh --host mongodb:27017 -u root -p olympian123 --authenticationDatabase admin --eval "
try {
  rs.initiate({
    _id: 'rs0',
    members: [{ _id: 0, host: 'mongodb:27017' }]
  });
  print('Replica set initiated successfully');
} catch (e) {
  print('Replica set already initiated or error:', e);
}
"
