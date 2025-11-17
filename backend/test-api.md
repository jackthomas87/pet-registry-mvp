# API Testing Guide

## Test the API Endpoints

### 1. Check Available Endpoints
```bash
curl http://localhost:3002/
```

### 2. Register a Pet
```bash
curl -X POST http://localhost:3002/api/register-pet \
  -H "Content-Type: application/json" \
  -d '{
    "ownerName": "John Doe",
    "ownerEmail": "john@example.com",
    "ownerPhone": "555-1234",
    "ownerAddress": "123 Main St",
    "microchipId": "123456789",
    "petName": "Buddy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "color": "Golden",
    "birthdate": "2020-01-15"
  }'
```

### 3. Look Up Pet by Microchip ID
```bash
curl http://localhost:3002/api/pet/123456789
```

### 4. Mark Pet as Lost
First, get the pet ID from the lookup response, then:
```bash
curl -X POST http://localhost:3002/api/pet/YOUR_PET_ID_HERE/mark-lost
```

### 5. Mark Pet as Found
```bash
curl -X POST http://localhost:3002/api/pet/YOUR_PET_ID_HERE/mark-found
```

### 6. Test Error Handling - Duplicate Microchip
```bash
curl -X POST http://localhost:3002/api/register-pet \
  -H "Content-Type: application/json" \
  -d '{
    "ownerName": "Jane Smith",
    "ownerEmail": "jane@example.com",
    "microchipId": "123456789",
    "petName": "Max",
    "species": "Cat"
  }'
```
Should return 409 error (microchip already exists)

### 7. Test Error Handling - Pet Not Found
```bash
curl http://localhost:3002/api/pet/999999999
```
Should return 404 error
