export const config = {
    // Server
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/atrax-game',
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || '6379',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  
    // Solana
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    SOLANA_PROGRAM_ID: process.env.SOLANA_PROGRAM_ID || '35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC',
    SOLANA_NETWORK: process.env.SOLANA_NETWORK || 'devnet',
  
    // JWT
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
    // Game
    GAME_TICK_RATE: parseInt(process.env.GAME_TICK_RATE || '60'),
    BLOCKCHAIN_SYNC_INTERVAL: parseInt(process.env.BLOCKCHAIN_SYNC_INTERVAL || '5000'),
    MAX_PLAYERS_PER_ROOM: parseInt(process.env.MAX_PLAYERS_PER_ROOM || '100'),
  };