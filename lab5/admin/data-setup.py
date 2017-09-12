import json
import requests

# people

apiPath = 'http://localhost:3000'
headers = {'Content-Type': 'application/json'}

person1 = {'personId': 'ID:1001', 'firstName': 'Alice', 'lastName': 'Armstrong'}
req_person1 = requests.post(apiPath + '/api/Person', json.dumps(person1), headers = headers)

person2 = {'personId': 'ID:1002', 'firstName': 'Bob', 'lastName': 'Bradley'}
req_person2 = requests.post(apiPath + '/api/Person', json.dumps(person2), headers = headers)

person3 = {'personId': 'ID:1003', 'firstName': 'Chris', 'lastName': 'Caldwell'}
req_person3 = requests.post(apiPath + '/api/Person', json.dumps(person3), headers = headers)

# properties

property1 = {'titleId': 'ID:2001', 'owner': 'resource:net.biz.digitalPropertyNetwork.Person#PID:101', 'information': 'Nice house in the mountains'}
req_property1 = requests.post(apiPath + '/api/LandTitle', json.dumps(property1), headers = headers)

property2 = {'titleId': 'ID:2002', 'owner': 'resource:net.biz.digitalPropertyNetwork.Person#PID:102', 'information': 'Small house in a village'}
req_property2 = requests.post(apiPath + '/api/LandTitle', json.dumps(property2), headers = headers)
