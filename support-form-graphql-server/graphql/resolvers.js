const { GraphQLUpload } = require('graphql-upload');
const path = require('path');
const fs = require('fs');

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    _empty: () => 'This is a placeholder query.',
    hello: () => 'Hello, world!',
  },

  Mutation: {
    uploadSupportRequest: async (_, { input }) => {
      const {
        name,
        email,
        typeOfIssue,
        walletServiceProvider,
        transactionHash,
        integrationDetails,
        walletAddress,
        tokenInvolved,
        marketInvolved,
        functionInvolved,
        errorCode,
        otherDetails,
        mobileOrDesktop,
        files,
      } = input;

      // Process uploaded files
      let savedFilePaths = [];
      if (files && files.length > 0) {
        for (const filePromise of files) {
          const file = await filePromise;
          const { createReadStream, filename, mimetype, encoding } = file;
          const stream = createReadStream();

          // Define the path to save the file
          const uploadDir = path.join(__dirname, '..', 'uploads');
          // Ensure the upload directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }

          const filePath = path.join(uploadDir, `${Date.now()}-${filename}`);
          const out = fs.createWriteStream(filePath);
          stream.pipe(out);
          await new Promise((resolve, reject) => {
            out.on('finish', resolve);
            out.on('error', reject);
          });

          savedFilePaths.push(filePath);
        }
      }

      // TODO: Save form data and file paths to a database or perform other processing
      console.log('Support Request Submitted:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Type of Issue:', typeOfIssue);
      console.log('Files:', savedFilePaths);

      return {
        success: true,
        message: 'Support request submitted successfully.',
      };
    },
  },
};

module.exports = resolvers;
