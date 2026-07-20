/**
 * OpenAPI 3.0 specification for the MERN Ecommerce API.
 * Served at /api-docs.json and rendered by Swagger UI at /api-docs.
 */
const keys = require('../config/keys');

const apiSegment =
  keys.app.apiURL && keys.app.apiURL !== 'undefined'
    ? keys.app.apiURL.replace(/^\/+|\/+$/g, '')
    : 'api';
const apiBase = `/${apiSegment}`;

const bearerAuth = [{ bearerAuth: [] }];

const errorResponse = {
  description: 'Error response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          success: { type: 'boolean', example: false }
        }
      }
    }
  }
};

const successMessage = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' }
  }
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'MERN Ecommerce API',
    description:
      'REST API for the MERN Ecommerce store. Authenticate with `POST /auth/login` or `/auth/register`, then pass the returned JWT as `Authorization: Bearer <token>`.',
    version: '1.0.0'
  },
  servers: [
    {
      url: '{serverUrl}',
      description: 'Configurable server',
      variables: {
        serverUrl: {
          default: keys.app.serverURL || 'http://localhost:3000',
          description: 'Base server URL (no trailing slash)'
        }
      }
    }
  ],
  tags: [
    { name: 'Auth', description: 'Login, register, password reset, OAuth' },
    { name: 'User', description: 'User profile and admin user listing' },
    { name: 'Address', description: 'Shipping addresses' },
    { name: 'Newsletter', description: 'Mailchimp newsletter' },
    { name: 'Product', description: 'Catalog and product admin' },
    { name: 'Category', description: 'Product categories' },
    { name: 'Brand', description: 'Brands / merchants brands' },
    { name: 'Contact', description: 'Contact form' },
    { name: 'Merchant', description: 'Merchant applications and approval' },
    { name: 'Cart', description: 'Shopping cart' },
    { name: 'Order', description: 'Orders and fulfillment status' },
    { name: 'Review', description: 'Product reviews' },
    { name: 'Wishlist', description: 'User wishlist' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from login/register. Header: `Authorization: Bearer <token>`'
      }
    },
    schemas: {
      UserPublic: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: {
            type: 'string',
            enum: ['ROLE ADMIN', 'ROLE MEMBER', 'ROLE MERCHANT']
          }
        }
      },
      AuthTokenResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          token: {
            type: 'string',
            description: 'Prefixed JWT, e.g. `Bearer eyJ...`'
          },
          user: { $ref: '#/components/schemas/UserPublic' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          sku: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          imageUrl: { type: 'string' },
          description: { type: 'string' },
          quantity: { type: 'number' },
          price: { type: 'number' },
          taxable: { type: 'boolean' },
          isActive: { type: 'boolean' },
          brand: { type: 'string', description: 'Brand ObjectId' }
        }
      },
      Address: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          zipCode: { type: 'string' },
          isDefault: { type: 'boolean' },
          user: { type: 'string' }
        }
      },
      CartItemStatus: {
        type: 'string',
        enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
      },
      ReviewStatus: {
        type: 'string',
        enum: ['Waiting Approval', 'Approved', 'Rejected']
      },
      MerchantStatus: {
        type: 'string',
        enum: ['Waiting Approval', 'Approved', 'Rejected']
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          totalPages: { type: 'integer' },
          currentPage: { type: 'integer' },
          count: { type: 'integer' }
        }
      }
    },
    parameters: {
      MongoId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'MongoDB ObjectId'
      },
      Page: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', default: 1 }
      },
      Limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', default: 10 }
      }
    }
  },
  paths: {
    // ── Auth ──────────────────────────────────────────────
    [`${apiBase}/auth/login`]: {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokenResponse' }
              }
            }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/auth/register`]: {
      post: {
        tags: ['Auth'],
        summary: 'Register a new member account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'firstName', 'lastName', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  password: { type: 'string', format: 'password' },
                  isSubscribed: {
                    type: 'boolean',
                    description: 'Subscribe to newsletter via Mailchimp'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Registered',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/AuthTokenResponse' },
                    {
                      type: 'object',
                      properties: { subscribed: { type: 'boolean' } }
                    }
                  ]
                }
              }
            }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/auth/forgot`]: {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Reset email sent (if account exists)',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/auth/reset/{token}`]: {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with email token',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: { password: { type: 'string', format: 'password' } }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Password updated',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/auth/reset`]: {
      post: {
        tags: ['Auth'],
        summary: 'Change password while authenticated',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'confirmPassword'],
                properties: {
                  password: {
                    type: 'string',
                    description: 'Current password'
                  },
                  confirmPassword: {
                    type: 'string',
                    description: 'New password'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Password changed',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse,
          401: errorResponse
        }
      }
    },
    [`${apiBase}/auth/google`]: {
      get: {
        tags: ['Auth'],
        summary: 'Start Google OAuth (browser redirect)',
        responses: {
          302: { description: 'Redirect to Google' }
        }
      }
    },
    [`${apiBase}/auth/google/callback`]: {
      get: {
        tags: ['Auth'],
        summary: 'Google OAuth callback (returns HTML that stores JWT)',
        responses: {
          200: {
            description: 'HTML page that sets localStorage token and redirects',
            content: { 'text/html': { schema: { type: 'string' } } }
          }
        }
      }
    },
    [`${apiBase}/auth/facebook`]: {
      get: {
        tags: ['Auth'],
        summary: 'Start Facebook OAuth (browser redirect)',
        responses: {
          302: { description: 'Redirect to Facebook' }
        }
      }
    },
    [`${apiBase}/auth/facebook/callback`]: {
      get: {
        tags: ['Auth'],
        summary: 'Facebook OAuth callback (returns HTML that stores JWT)',
        responses: {
          200: {
            description: 'HTML page that sets localStorage token and redirects',
            content: { 'text/html': { schema: { type: 'string' } } }
          }
        }
      }
    },

    // ── User ──────────────────────────────────────────────
    [`${apiBase}/user/search`]: {
      get: {
        tags: ['User'],
        summary: 'Search users (Admin)',
        security: bearerAuth,
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Match firstName, lastName, or email'
          }
        ],
        responses: {
          200: {
            description: 'Matching users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/user`]: {
      get: {
        tags: ['User'],
        summary: 'List users (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'Paginated users',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        users: { type: 'array', items: { type: 'object' } }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          },
          401: errorResponse
        }
      },
      put: {
        tags: ['User'],
        summary: 'Update current user profile',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  profile: {
                    type: 'object',
                    properties: {
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      email: { type: 'string' },
                      phoneNumber: { type: 'string' },
                      avatar: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    user: { type: 'object' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/user/me`]: {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { user: { type: 'object' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },

    // ── Address ───────────────────────────────────────────
    [`${apiBase}/address/add`]: {
      post: {
        tags: ['Address'],
        summary: 'Create address for current user',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  address: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                  country: { type: 'string' },
                  zipCode: { type: 'string' },
                  isDefault: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Address created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    address: { $ref: '#/components/schemas/Address' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/address`]: {
      get: {
        tags: ['Address'],
        summary: 'List addresses for current user',
        security: bearerAuth,
        responses: {
          200: {
            description: 'User addresses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    addresses: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Address' }
                    }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/address/{id}`]: {
      get: {
        tags: ['Address'],
        summary: 'Get address by id',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Address',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    address: { $ref: '#/components/schemas/Address' }
                  }
                }
              }
            }
          },
          404: errorResponse
        }
      },
      put: {
        tags: ['Address'],
        summary: 'Update address',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Address' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/address/delete/{id}`]: {
      delete: {
        tags: ['Address'],
        summary: 'Delete address',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse
        }
      }
    },

    // ── Newsletter ────────────────────────────────────────
    [`${apiBase}/newsletter/subscribe`]: {
      post: {
        tags: ['Newsletter'],
        summary: 'Subscribe email to newsletter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Subscribed',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse
        }
      }
    },

    // ── Product ───────────────────────────────────────────
    [`${apiBase}/product/item/{slug}`]: {
      get: {
        tags: ['Product'],
        summary: 'Get active product by slug (storefront)',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: errorResponse
        }
      }
    },
    [`${apiBase}/product/list/search/{name}`]: {
      get: {
        tags: ['Product'],
        summary: 'Search products by name',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Matching products (name, slug, imageUrl, price)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/product/list`]: {
      get: {
        tags: ['Product'],
        summary: 'Filtered storefront product list',
        description:
          'Optional Bearer token enables wishlist `isLiked` on products.',
        parameters: [
          {
            name: 'sortOrder',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'JSON string for Mongo sort, e.g. `{"price":1}`'
          },
          {
            name: 'rating',
            in: 'query',
            schema: { type: 'number' }
          },
          {
            name: 'min',
            in: 'query',
            schema: { type: 'number' }
          },
          {
            name: 'max',
            in: 'query',
            schema: { type: 'number' }
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string' },
            description: 'Category slug'
          },
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'Paginated products',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        products: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Product' }
                        }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/product/list/brand/{slug}`]: {
      get: {
        tags: ['Product'],
        summary: 'Active products for a brand (max 8)',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Brand products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: { type: 'array', items: { type: 'object' } },
                    page: { type: 'integer' },
                    pages: { type: 'integer' },
                    totalProducts: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/product/list/select`]: {
      get: {
        tags: ['Product'],
        summary: 'Product id/name list for selects',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Products for dropdowns',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/product/add`]: {
      post: {
        tags: ['Product'],
        summary: 'Create product with image (Admin or Merchant)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['sku', 'name', 'description', 'quantity', 'price'],
                properties: {
                  sku: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                  taxable: { type: 'boolean' },
                  isActive: { type: 'boolean' },
                  brand: { type: 'string' },
                  image: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Product created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/product`]: {
      get: {
        tags: ['Product'],
        summary: 'Dashboard product list (Admin or Merchant)',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Products (merchants scoped to their brand)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/product/{id}`]: {
      get: {
        tags: ['Product'],
        summary: 'Get product by id (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    product: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      },
      put: {
        tags: ['Product'],
        summary: 'Update product (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: { $ref: '#/components/schemas/Product' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          400: errorResponse,
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/product/{id}/active`]: {
      put: {
        tags: ['Product'],
        summary: 'Toggle product active state (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: { isActive: { type: 'boolean' } }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/product/delete/{id}`]: {
      delete: {
        tags: ['Product'],
        summary: 'Delete product (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },

    // ── Category ──────────────────────────────────────────
    [`${apiBase}/category/add`]: {
      post: {
        tags: ['Category'],
        summary: 'Create category (Admin)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  products: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Product ObjectIds'
                  },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    category: { type: 'object' }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/category/list`]: {
      get: {
        tags: ['Category'],
        summary: 'List active categories (storefront)',
        responses: {
          200: {
            description: 'Active categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    categories: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/category`]: {
      get: {
        tags: ['Category'],
        summary: 'List all categories',
        responses: {
          200: {
            description: 'All categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    categories: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/category/{id}`]: {
      get: {
        tags: ['Category'],
        summary: 'Get category by id',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Category with product names',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { category: { type: 'object' } }
                }
              }
            }
          },
          404: errorResponse
        }
      },
      put: {
        tags: ['Category'],
        summary: 'Update category (Admin)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { category: { type: 'object' } }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/category/{id}/active`]: {
      put: {
        tags: ['Category'],
        summary: 'Toggle category active (Admin)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  category: {
                    type: 'object',
                    properties: { isActive: { type: 'boolean' } }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/category/delete/{id}`]: {
      delete: {
        tags: ['Category'],
        summary: 'Delete category (Admin)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },

    // ── Brand ─────────────────────────────────────────────
    [`${apiBase}/brand/add`]: {
      post: {
        tags: ['Brand'],
        summary: 'Create brand (Admin)',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  isActive: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    brand: { type: 'object' }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/brand/list`]: {
      get: {
        tags: ['Brand'],
        summary: 'List active brands (storefront)',
        responses: {
          200: {
            description: 'Active brands',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    brands: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/brand/list/select`]: {
      get: {
        tags: ['Brand'],
        summary: 'Brand names for selects (Admin or Merchant)',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Brand options',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    brands: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/brand`]: {
      get: {
        tags: ['Brand'],
        summary: 'Dashboard brand list (Admin or Merchant)',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Brands',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    brands: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/brand/{id}`]: {
      get: {
        tags: ['Brand'],
        summary: 'Get brand by id',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Brand',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { brand: { type: 'object' } }
                }
              }
            }
          },
          404: errorResponse
        }
      },
      put: {
        tags: ['Brand'],
        summary: 'Update brand (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { brand: { type: 'object' } }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/brand/{id}/active`]: {
      put: {
        tags: ['Brand'],
        summary: 'Toggle brand active (Admin or Merchant)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  brand: {
                    type: 'object',
                    properties: { isActive: { type: 'boolean' } }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/brand/delete/{id}`]: {
      delete: {
        tags: ['Brand'],
        summary: 'Delete brand (Admin)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },

    // ── Contact ───────────────────────────────────────────
    [`${apiBase}/contact/add`]: {
      post: {
        tags: ['Contact'],
        summary: 'Submit contact form',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'message'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    contact: { type: 'object' }
                  }
                }
              }
            }
          },
          400: errorResponse
        }
      }
    },

    // ── Merchant ──────────────────────────────────────────
    [`${apiBase}/merchant/add`]: {
      post: {
        tags: ['Merchant'],
        summary: 'Submit merchant application',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'business', 'phoneNumber'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  business: { type: 'string' },
                  phoneNumber: { type: 'string' },
                  brandName: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Application created (Waiting Approval)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    merchant: { type: 'object' }
                  }
                }
              }
            }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/search`]: {
      get: {
        tags: ['Merchant'],
        summary: 'Search merchants (Admin)',
        security: bearerAuth,
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Matching merchants',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    merchants: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/merchant`]: {
      get: {
        tags: ['Merchant'],
        summary: 'List merchants paginated (Admin)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'Paginated merchants',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        merchants: { type: 'array', items: { type: 'object' } }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/{id}/active`]: {
      put: {
        tags: ['Merchant'],
        summary: 'Enable or disable merchant',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  merchant: {
                    type: 'object',
                    properties: { isActive: { type: 'boolean' } }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/approve/{id}`]: {
      put: {
        tags: ['Merchant'],
        summary: 'Approve merchant application',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Approved; signup email sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/reject/{id}`]: {
      put: {
        tags: ['Merchant'],
        summary: 'Reject merchant application',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Rejected',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/signup/{token}`]: {
      post: {
        tags: ['Merchant'],
        summary: 'Complete merchant signup after approval',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'resetPasswordToken from approval email'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'firstName', 'lastName', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  password: { type: 'string', format: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Merchant account activated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          400: errorResponse
        }
      }
    },
    [`${apiBase}/merchant/delete/{id}`]: {
      delete: {
        tags: ['Merchant'],
        summary: 'Delete merchant (Admin)',
        security: bearerAuth,
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse,
          403: errorResponse
        }
      }
    },

    // ── Cart ──────────────────────────────────────────────
    [`${apiBase}/cart/add`]: {
      post: {
        tags: ['Cart'],
        summary: 'Create cart from products',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['products'],
                properties: {
                  products: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        product: { type: 'string', description: 'Product ObjectId' },
                        quantity: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Cart created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    cartId: { type: 'string' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/cart/add/{cartId}`]: {
      post: {
        tags: ['Cart'],
        summary: 'Add product to existing cart',
        security: bearerAuth,
        parameters: [
          {
            name: 'cartId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      product: { type: 'string' },
                      quantity: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Item added',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/cart/delete/{cartId}`]: {
      delete: {
        tags: ['Cart'],
        summary: 'Delete entire cart',
        security: bearerAuth,
        parameters: [
          {
            name: 'cartId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/cart/delete/{cartId}/{productId}`]: {
      delete: {
        tags: ['Cart'],
        summary: 'Remove product from cart',
        security: bearerAuth,
        parameters: [
          {
            name: 'cartId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Removed',
            content: { 'application/json': { schema: successMessage } }
          },
          401: errorResponse
        }
      }
    },

    // ── Order ─────────────────────────────────────────────
    [`${apiBase}/order/add`]: {
      post: {
        tags: ['Order'],
        summary: 'Place order from cart',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cartId', 'total'],
                properties: {
                  cartId: { type: 'string' },
                  total: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Order created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    order: {
                      type: 'object',
                      properties: { _id: { type: 'string' } }
                    }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/order/search`]: {
      get: {
        tags: ['Order'],
        summary: 'Search order by id',
        security: bearerAuth,
        parameters: [
          {
            name: 'search',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Order ObjectId'
          }
        ],
        responses: {
          200: {
            description: 'Matching orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orders: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/order`]: {
      get: {
        tags: ['Order'],
        summary: 'List all orders (paginated)',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'Paginated orders',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        orders: { type: 'array', items: { type: 'object' } }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/order/me`]: {
      get: {
        tags: ['Order'],
        summary: 'List current user orders',
        security: bearerAuth,
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'User orders',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        orders: { type: 'array', items: { type: 'object' } }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/order/{orderId}`]: {
      get: {
        tags: ['Order'],
        summary: 'Get order detail',
        security: bearerAuth,
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Order with products and tax',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { order: { type: 'object' } }
                }
              }
            }
          },
          401: errorResponse,
          404: errorResponse
        }
      }
    },
    [`${apiBase}/order/cancel/{orderId}`]: {
      delete: {
        tags: ['Order'],
        summary: 'Cancel order and restock',
        security: bearerAuth,
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Cancelled',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/order/status/item/{itemId}`]: {
      put: {
        tags: ['Order'],
        summary: 'Update cart line-item status',
        security: bearerAuth,
        parameters: [
          {
            name: 'itemId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Cart item subdocument _id'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId', 'cartId'],
                properties: {
                  orderId: { type: 'string' },
                  cartId: { type: 'string' },
                  status: { $ref: '#/components/schemas/CartItemStatus' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Status updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    orderCancelled: { type: 'boolean' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },

    // ── Review ────────────────────────────────────────────
    [`${apiBase}/review/add`]: {
      post: {
        tags: ['Review'],
        summary: 'Submit product review',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  title: { type: 'string' },
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  review: { type: 'string' },
                  isRecommended: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Review submitted (Waiting Approval)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    review: { type: 'object' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/review`]: {
      get: {
        tags: ['Review'],
        summary: 'List all reviews (paginated)',
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/Limit' }
        ],
        responses: {
          200: {
            description: 'Paginated reviews',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    {
                      type: 'object',
                      properties: {
                        reviews: { type: 'array', items: { type: 'object' } }
                      }
                    },
                    { $ref: '#/components/schemas/PaginationMeta' }
                  ]
                }
              }
            }
          }
        }
      }
    },
    [`${apiBase}/review/{slug}`]: {
      get: {
        tags: ['Review'],
        summary: 'Approved reviews for a product slug',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Product slug'
          }
        ],
        responses: {
          200: {
            description: 'Approved reviews',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    reviews: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Review'],
        summary: 'Update review by id',
        description: 'Path param is review ObjectId despite the `{slug}` name in routing.',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Review ObjectId'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object' }
            }
          }
        },
        responses: {
          200: {
            description: 'Updated',
            content: { 'application/json': { schema: successMessage } }
          }
        }
      }
    },
    [`${apiBase}/review/approve/{reviewId}`]: {
      put: {
        tags: ['Review'],
        summary: 'Approve review',
        security: bearerAuth,
        parameters: [
          {
            name: 'reviewId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Approved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/review/reject/{reviewId}`]: {
      put: {
        tags: ['Review'],
        summary: 'Reject review',
        security: bearerAuth,
        parameters: [
          {
            name: 'reviewId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Rejected',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' } }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    },
    [`${apiBase}/review/delete/{id}`]: {
      delete: {
        tags: ['Review'],
        summary: 'Delete review',
        parameters: [{ $ref: '#/components/parameters/MongoId' }],
        responses: {
          200: {
            description: 'Deleted',
            content: { 'application/json': { schema: successMessage } }
          }
        }
      }
    },

    // ── Wishlist ──────────────────────────────────────────
    [`${apiBase}/wishlist`]: {
      post: {
        tags: ['Wishlist'],
        summary: 'Upsert wishlist entry',
        security: bearerAuth,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product', 'isLiked'],
                properties: {
                  product: { type: 'string', description: 'Product ObjectId' },
                  isLiked: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Wishlist updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    wishlist: { type: 'object' }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      },
      get: {
        tags: ['Wishlist'],
        summary: 'Get liked wishlist items',
        security: bearerAuth,
        responses: {
          200: {
            description: 'Wishlist products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    wishlist: { type: 'array', items: { type: 'object' } }
                  }
                }
              }
            }
          },
          401: errorResponse
        }
      }
    }
  }
};
