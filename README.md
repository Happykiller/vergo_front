# Vergo Front
Web Client for Service Vergo

## Deployment Instructions (MEP)

### Image Creation

1. **Important**: Before creating the Docker image, ensure that the `.env.local` file is properly configured with your environment-specific settings. This file contains sensitive information and should **not** be included in version control.

   - **Warning**: Make sure the `.env.local` file is correctly set up for your local environment. This file should be kept private and secure.

2. **Build the Docker Image**:
   
   Run the following command to package your application and its dependencies into a Docker image:

   ```bash
   make tar
   ```

   This command will create a Docker image that you can use for deployment.

### Transfer to Server

1. **Transfer Files**:

   Use a file transfer tool such as WinSCP to upload the Docker image or other necessary files to your server.

   - **Alternative**: You can also use `scp` (secure copy) if you prefer command-line tools for file transfer:

     ```bash
     scp path/to/your/file username@hostname:/path/to/destination
     ```

   Ensure that you transfer all relevant files to the appropriate directory on your server.

### Install on Server

1. **Install Dependencies and Set Up Application**:

   On your server, run the following command to install necessary dependencies and prepare the application for use:

   ```bash
   make install
   ```

   This command will ensure that all required packages and configurations are applied, setting up your application for operation.