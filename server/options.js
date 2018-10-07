exports.routes = {
  messages: '/classes/messages',
  domain: '/',
  styles: '/styles/styles.css',
  scripts: '/scripts',
  images: '/images',
  modules: '/node_modules'
};

exports.options = {
  '/classes/messages': {
    POST: {
      description: 'Create new post',
      parameters: {
        username: {
          type: 'string',
          description: 'Username.',
          required: true
        },
        text: {
          type: 'string',
          description: 'Message text.',
          required: true
        },
        roomname: {
          type: 'string',
          description: 'Chatroom name.',
          required: true
        }
      },
      example: {
        username: 'lisa',
        text: 'fun times.',
        roomname: 'hack reactor'
      }
    },
    GET: {
      description: 'Get all messages',
      parameters: {
        order: {
          type: 'string',
          description: 'Sort order for messages.',
          examples: ['-createdAt', '-username', '-objectId'],
          required: false
        }
      },
      example: {
        order: '-createdAt'
      }
    }
  }
};