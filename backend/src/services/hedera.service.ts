import {
  Client,
  PrivateKey,
  AccountId,
  TopicMessageSubmitTransaction,
  TopicId,
  TopicCreateTransaction,
  Hbar,
} from '@hashgraph/sdk';

// Hedera client singleton
let client: Client | null = null;
let topicId: TopicId | null = null;

/**
 * Initialize Hedera client
 */
export function initializeHederaClient(): Client {
  if (client) {
    return client;
  }

  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;
  const network = process.env.HEDERA_NETWORK || 'testnet';

  if (!accountId || !privateKey) {
    throw new Error('Hedera credentials not configured');
  }

  // Create client for testnet
  if (network === 'testnet') {
    client = Client.forTestnet();
  } else if (network === 'mainnet') {
    client = Client.forMainnet();
  } else {
    throw new Error(`Invalid Hedera network: ${network}`);
  }

  // Set operator (account that pays for transactions)
  client.setOperator(
    AccountId.fromString(accountId),
    PrivateKey.fromStringECDSA(privateKey)
  );

  // Set default transaction fee and query payment using Hbar
  client.setDefaultMaxTransactionFee(new Hbar(2)); // 2 HBAR max
  client.setDefaultMaxQueryPayment(new Hbar(1)); // 1 HBAR max

  console.log('✅ Hedera client initialized');
  console.log(`   Account: ${accountId}`);
  console.log(`   Network: ${network}`);

  return client;
}

/**
 * Get or create a topic for pet registry messages
 */
export async function getOrCreateTopic(): Promise<TopicId> {
  if (topicId) {
    return topicId;
  }

  const hederaClient = initializeHederaClient();

  try {
    // Create a new topic for pet registry
    const transaction = new TopicCreateTransaction()
      .setTopicMemo('Pet Registry - Decentralized Pet Microchip Records')
      .setAdminKey(hederaClient.operatorPublicKey!);

    const txResponse = await transaction.execute(hederaClient);
    const receipt = await txResponse.getReceipt(hederaClient);
    
    topicId = receipt.topicId!;
    
    console.log('✅ Created Hedera topic:', topicId.toString());
    
    return topicId;
  } catch (error) {
    console.error('❌ Failed to create Hedera topic:', error);
    throw new Error('Failed to create Hedera topic');
  }
}

/**
 * Submit a hash to Hedera consensus service
 */
export async function submitHashToHedera(
  hash: string,
  metadata?: Record<string, any>
): Promise<string> {
  try {
    const hederaClient = initializeHederaClient();
    const topic = await getOrCreateTopic();

    // Create message to submit
    const message = JSON.stringify({
      hash,
      metadata,
      timestamp: new Date().toISOString(),
    });

    // Submit message to topic
    const transaction = new TopicMessageSubmitTransaction({
      topicId: topic,
      message: message,
    });

    const txResponse = await transaction.execute(hederaClient);
    const receipt = await txResponse.getReceipt(hederaClient);

    // Get transaction ID as proof
    const transactionId = txResponse.transactionId.toString();

    console.log('✅ Hash submitted to Hedera');
    console.log(`   Transaction ID: ${transactionId}`);
    console.log(`   Hash: ${hash}`);

    return transactionId;
  } catch (error) {
    console.error('❌ Failed to submit hash to Hedera:', error);
    throw new Error('Failed to submit to blockchain');
  }
}

/**
 * Submit pet registration hash to Hedera
 */
export async function submitPetRegistration(
  microchipId: string,
  hash: string
): Promise<string> {
  return submitHashToHedera(hash, {
    type: 'PET_REGISTRATION',
    microchipId,
  });
}

/**
 * Submit ownership transfer hash to Hedera
 */
export async function submitOwnershipTransfer(
  petId: string,
  microchipId: string,
  hash: string
): Promise<string> {
  return submitHashToHedera(hash, {
    type: 'OWNERSHIP_TRANSFER',
    petId,
    microchipId,
  });
}

/**
 * Close Hedera client connection
 */
export async function closeHederaClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    topicId = null;
    console.log('✅ Hedera client closed');
  }
}
