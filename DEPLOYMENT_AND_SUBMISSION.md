# Deployment and Submission Guide

## 1. Publish the website

This project is ready to deploy on Render.

### Render steps
1. Push this project to GitHub.
2. Go to Render and create a new `Web Service`.
3. Connect your GitHub repository.
4. Render will detect the included `render.yaml`.
5. Set the secret environment variables:
   - `DATABASE`
   - `JWT_SECRET`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USERNAME`
   - `EMAIL_PASSWORD`
6. Deploy the app.
7. After deployment, copy your live link.

### Quick checks after deployment
- Open `https://your-live-link.onrender.com/`
- Open `https://your-live-link.onrender.com/health`
- Open `https://your-live-link.onrender.com/overview`

## 2. Test CRUD in Postman using the live link

Import the files:
- `postman-live-crud-collection.json`
- `postman-live-environment.json`

Set `baseUrl` in the Postman environment to your live link, for example:

`https://your-live-link.onrender.com`

### Suggested test order
1. `Signup Admin User`
2. `Login Admin User`
3. `Create Product`
4. `Read All Products`
5. `Read One Product`
6. `Update Product`
7. `Delete Product`

Notes:
- The collection saves `token` automatically after login.
- The collection saves `productId` automatically after create.
- The delete route requires an admin token.

## 3. Screenshots for submission

Take screenshots of the Postman results for:
- create product
- read product(s)
- update product
- delete product
- optional: login and health check

Put the screenshots in either:
- a Google Drive folder, or
- a ZIP file

## 4. Website link to submit

Submit your deployed website link, for example:

`https://your-live-link.onrender.com`

## 5. Optional local command for live endpoint verification

After deployment, you can run:

```powershell
$env:BASE_URL="https://your-live-link.onrender.com"
npm run test:live
```
