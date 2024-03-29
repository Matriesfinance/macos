import prisma from './prisma.mjs'

const notificationTemplates = [
  {
    id: 1,
    name: 'EmailVerification',
    subject: 'Please verify your email',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You recently created an account at %URL% on %CREATED_AT%. Please verify your email to continue with your account. Please follow the link below to verify your email.</p>\n<p>Follow the link to verify your email: %URL%/confirm/verifyemail?token=%TOKEN%</p>',
    short_codes: '["FIRSTNAME", "CREATED_AT", "TOKEN"]',
    email: true,
  },
  {
    id: 2,
    name: 'PasswordReset',
    subject: 'Password Reset Request',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You requested to reset your password. Please follow the link below. If you did not request to reset your password, disregard this email. Your last login time was: %LAST_LOGIN%.</p>\n<p>This is a one-time password link that will reveal a temporary password.</p>\n<p>Password reset link: %URL%/confirm/password-reset?token=%TOKEN%</p>',
    short_codes: '["FIRSTNAME", "LAST_LOGIN", "TOKEN"]',
    email: true,
  },
  {
    id: 3,
    name: 'EmailTest',
    subject: 'Email System Test',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your email system at %URL% is working as expected. This test email was sent on %TIME%.</p>\n<p>If you did not expect this email, please contact support.</p>',
    short_codes: '["FIRSTNAME", "TIME"]',
    email: true,
  },
  {
    id: 4,
    name: 'KycSubmission',
    subject: 'KYC Submission Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Thank you for submitting your KYC application on %CREATED_AT%. Your application is now under review.</p>\n<p>Level: %LEVEL%</p>\n<p>Status: %STATUS%</p>',
    short_codes: '["FIRSTNAME", "CREATED_AT", "LEVEL", "STATUS"]',
    email: true,
  },
  {
    id: 5,
    name: 'KycUpdate',
    subject: 'KYC Update Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your KYC application has been updated on %UPDATED_AT%. It is now under review again.</p>\n<p>Updated Level: %LEVEL%</p>\n<p>Status: %STATUS%</p>',
    short_codes: '["FIRSTNAME", "UPDATED_AT", "LEVEL", "STATUS"]',
    email: true,
  },
  {
    id: 6,
    name: 'KycApproved',
    subject: 'Your KYC Application has been Approved',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your KYC application submitted on %UPDATED_AT% has been approved.</p>\n<p>Your current level is: %LEVEL%</p>\n<p>Thank you for your cooperation.</p>\n<p>Best regards,</p>\n<p> YourSupport Team</p>',
    short_codes: '["FIRSTNAME", "UPDATED_AT", "LEVEL"]',
    email: true,
  },
  {
    id: 7,
    name: 'KycRejected',
    subject: 'Your KYC Application has been Rejected',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Unfortunately, your KYC application submitted on %UPDATED_AT% has been rejected.</p>\n<p>Reason: %MESSAGE%</p>\n<p>Please contact our support team for more information.</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["FIRSTNAME", "UPDATED_AT", "MESSAGE", "LEVEL"]',
    email: true,
  },
  {
    id: 8,
    name: 'NewInvestmentCreated',
    subject: 'New Investment Created',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have successfully created a new investment in the %PLAN_NAME% plan.</p>\n<p>Amount Invested: %AMOUNT% %CURRENCY%</p>\n<p>Duration: %DURATION% days</p>\n<p>Expected ROI: %ROI%</p>\n<p>Status: %STATUS%</p>',
    short_codes:
      '["FIRSTNAME", "PLAN_NAME", "AMOUNT", "CURRENCY", "DURATION", "ROI", "STATUS"]',
    email: true,
  },
  {
    id: 9,
    name: 'InvestmentUpdated',
    subject: 'Investment Updated',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your investment in the %PLAN_NAME% plan has been updated.</p>\n<p>New Amount: %AMOUNT% %CURRENCY%</p>\n<p>New Duration: %DURATION% days</p>\n<p>New Expected ROI: %ROI%</p>\n<p>Status: %STATUS%</p>',
    short_codes:
      '["FIRSTNAME", "PLAN_NAME", "AMOUNT", "CURRENCY", "DURATION", "ROI", "STATUS"]',
    email: true,
  },
  {
    id: 10,
    name: 'InvestmentCanceled',
    subject: 'Investment Canceled',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your investment in the %PLAN_NAME% plan has been canceled.</p>\n<p>Amount Returned: %AMOUNT% %CURRENCY%</p>\n<p>Status: %STATUS%</p>',
    short_codes: '["FIRSTNAME", "PLAN_NAME", "AMOUNT", "CURRENCY", "STATUS"]',
    email: true,
  },
  {
    id: 11,
    name: 'UserMessage',
    subject: 'New Message From Support',
    email_body:
      '<p>Dear %RECEIVER_NAME%,</p>\n<p>You have a new message from our support team regarding ticket ID: %TICKET_ID%.</p>\n<p>Message:</p>\n<p>%MESSAGE%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["RECEIVER_NAME", "TICKET_ID", "MESSAGE"]',
    email: true,
  },
  {
    id: 12,
    name: 'SupportMessage',
    subject: 'New User Message',
    email_body:
      '<p>Dear %RECEIVER_NAME%,</p>\n<p>You have a new message from %SENDER_NAME% regarding ticket ID: %TICKET_ID%.</p>\n<p>Message:</p>\n<p>%MESSAGE%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["RECEIVER_NAME", "SENDER_NAME", "TICKET_ID", "MESSAGE"]',
    email: true,
  },
  {
    id: 13,
    name: 'FiatWalletTransaction',
    subject: 'Transaction Alert: %TRANSACTION_TYPE%',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have recently made a %TRANSACTION_TYPE% transaction.</p>\n<p>Details:</p>\n<ul>\n<li>Transaction ID: %TRANSACTION_ID%</li>\n<li>Amount: %AMOUNT% %CURRENCY%</li>\n<li>Status: %TRANSACTION_STATUS%</li>\n<li>Current Wallet Balance: %NEW_BALANCE% %CURRENCY%</li>\n<li>Description: %DESCRIPTION%</li>\n</ul>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "TRANSACTION_TYPE", "TRANSACTION_ID", "AMOUNT", "CURRENCY", "TRANSACTION_STATUS", "NEW_BALANCE", "DESCRIPTION"]',
    email: true,
  },
  {
    id: 14,
    name: 'BinaryOrderResult',
    subject: 'Binary Order Result: %RESULT%',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Here is the outcome of your recent binary order (ID: %ORDER_ID%).</p>\n<p><strong>Order Details:</strong></p>\n<ul>\n  <li><strong>Market:</strong> %MARKET%</li>\n  <li><strong>Amount:</strong> %AMOUNT% %CURRENCY%</li>\n  <li><strong>Entry Price:</strong> %ENTRY_PRICE%</li>\n  <li><strong>Closed at Price:</strong> %CLOSE_PRICE%</li>\n</ul>\n<p><strong>Order Outcome:</strong></p>\n<ul>\n  <li><strong>Result:</strong> %RESULT%</li>\n  <li><strong>Profit/Loss:</strong> %PROFIT% %CURRENCY%</li>\n  <li><strong>Side:</strong> %SIDE%</li>\n</ul>\n<p>Thank you for using our platform.</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "ORDER_ID", "RESULT", "MARKET", "AMOUNT", "PROFIT", "SIDE", "CURRENCY", "ENTRY_PRICE", "CLOSE_PRICE"]',
    email: true,
  },
  {
    id: 15,
    name: 'WalletBalanceUpdate',
    subject: 'Wallet Balance Update',
    email_body:
      '<p>Hello %FIRSTNAME%,</p>\n<p>Your wallet balance has been %ACTION% by an admin.</p>\n<p>Details:</p>\n<ul>\n<li>Action: %ACTION%</li>\n<li>Amount: %AMOUNT% %CURRENCY%</li>\n<li>New Balance: %NEW_BALANCE% %CURRENCY%</li>\n</ul>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["FIRSTNAME", "ACTION", "AMOUNT", "CURRENCY", "NEW_BALANCE"]',
    email: true,
  },
  {
    id: 16,
    name: 'TransactionStatusUpdate',
    subject: 'Transaction Status Update: %TRANSACTION_TYPE%',
    email_body:
      '<p>Hello %FIRSTNAME%,</p>\n<p>Your transaction of type %TRANSACTION_TYPE% has been updated.</p>\n<p>Details:</p>\n<ul>\n<li>Transaction ID: %TRANSACTION_ID%</li>\n<li>Status: %TRANSACTION_STATUS%</li>\n<li>Amount: %AMOUNT% %CURRENCY%</li>\n<li>Updated Balance: %NEW_BALANCE% %CURRENCY%</li>\n<li>Note: %NOTE%</li>\n</ul>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "TRANSACTION_TYPE", "TRANSACTION_ID", "TRANSACTION_STATUS", "AMOUNT", "CURRENCY", "NEW_BALANCE", "NOTE"]',
    email: true,
  },
  {
    id: 17,
    name: 'AuthorStatusUpdate',
    subject: 'Author Application Status: %AUTHOR_STATUS%',
    email_body:
      '<p>Hello %FIRSTNAME%,</p>\n<p>Your application to join our Authorship Program has been %AUTHOR_STATUS%.</p>\n<p>Details:</p>\n<ul>\n<li>Application ID: %APPLICATION_ID%</li>\n<li>Status: %AUTHOR_STATUS%</li>\n</ul>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["FIRSTNAME", "AUTHOR_STATUS", "APPLICATION_ID"]',
    email: true,
  },
  {
    id: 18,
    name: 'OutgoingWalletTransfer',
    subject: 'Outgoing Wallet Transfer Confirmation',
    email_body:
      '<p>Hello %FIRSTNAME%,</p>\n<p>You have successfully transferred %AMOUNT% %CURRENCY% to %RECIPIENT_NAME%.</p>\n<p>Your new balance: %NEW_BALANCE% %CURRENCY%</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>',
    short_codes:
      '["FIRSTNAME", "AMOUNT", "CURRENCY", "NEW_BALANCE", "TRANSACTION_ID", "RECIPIENT_NAME"]',
    email: true,
  },
  {
    id: 19,
    name: 'IncomingWalletTransfer',
    subject: 'Incoming Wallet Transfer Confirmation',
    email_body:
      '<p>Hello %FIRSTNAME%,</p>\n<p>You have received %AMOUNT% %CURRENCY% from %SENDER_NAME%.</p>\n<p>Your new balance: %NEW_BALANCE% %CURRENCY%</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>',
    short_codes:
      '["FIRSTNAME", "AMOUNT", "CURRENCY", "NEW_BALANCE", "TRANSACTION_ID", "SENDER_NAME"]',
    email: true,
  },
  {
    id: 20,
    name: 'SpotWalletWithdrawalConfirmation',
    subject: 'Confirmation: Spot Wallet Withdrawal',
    email_body:
      '<p>Dear %FIRSTNAME%,</p><p>You have successfully initiated a withdrawal from your Spot Wallet.</p><p>Details:</p><ul><li>Amount: %AMOUNT% %CURRENCY%</li><li>Address: %ADDRESS%</li><li>Transaction Fee: %FEE%</li><li>Network Chain: %CHAIN%</li><li>Memo: %MEMO%</li><li>Status: %STATUS%</li></ul><p>If you did not make this request, please contact our support immediately.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "AMOUNT", "CURRENCY", "ADDRESS", "FEE", "CHAIN", "MEMO", "STATUS"]',
    email: true,
  },
  {
    id: 21,
    name: 'SpotWalletDepositConfirmation',
    subject: 'Confirmation: Spot Wallet Deposit',
    email_body:
      '<p>Dear %FIRSTNAME%,</p><p>Your spot wallet deposit has been successfully processed.</p><p>Details:</p><ul><li>Transaction ID: %TRANSACTION_ID%</li><li>Amount: %AMOUNT% %CURRENCY%</li><li>Network Chain: %CHAIN%</li><li>Transaction Fee: %FEE%</li><li>Status: COMPLETED</li></ul><p>If you did not make this deposit, please contact our support immediately.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "TRANSACTION_ID", "AMOUNT", "CURRENCY", "CHAIN", "FEE"]',
    email: true,
  },
  {
    id: 22,
    name: 'NewAiInvestmentCreated',
    subject: 'New AI Investment Initiated',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have successfully created a new AI investment in the %PLAN_NAME% plan.</p>\n<p>Amount Invested: %AMOUNT% %CURRENCY%</p>\n<p>Duration: %DURATION% %TIMEFRAME%</p>\n<p>Status: %STATUS%</p>',
    short_codes:
      '["FIRSTNAME", "PLAN_NAME", "AMOUNT", "CURRENCY", "DURATION", "TIMEFRAME", "STATUS"]',
    email: true,
  },
  {
    id: 23,
    name: 'AiInvestmentCompleted',
    subject: 'AI Investment Completed',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your AI investment in the %PLAN_NAME% plan has been completed.</p>\n<p>Invested Amount: %AMOUNT% %CURRENCY%</p>\n<p>Result: %PROFIT% %CURRENCY%</p>\n<p>Status: %STATUS%</p>',
    short_codes:
      '["FIRSTNAME", "PLAN_NAME","AMOUNT", "PROFIT", "CURRENCY", "STATUS"]',
    email: true,
  },
  {
    id: 24,
    name: 'AiInvestmentCanceled',
    subject: 'AI Investment Canceled',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your AI investment in the %PLAN_NAME% plan has been canceled.</p>\n<p>Amount Refunded: %AMOUNT% %CURRENCY%</p>\n<p>Status: %STATUS%</p>',
    short_codes: '["FIRSTNAME", "PLAN_NAME", "AMOUNT", "CURRENCY", "STATUS"]',
    email: true,
  },
  {
    id: 25,
    name: 'WithdrawalStatus',
    subject: 'Withdrawal Status: %STATUS%',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your withdrawal request has been %STATUS%.</p>\n<p>If the withdrawal is canceled, the reason is: %REASON%.</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>\n<p>Amount: %AMOUNT% %CURRENCY%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "STATUS", "REASON", "TRANSACTION_ID", "AMOUNT", "CURRENCY"]',
    email: true,
  },
  {
    id: 26,
    name: 'DepositConfirmation',
    subject: 'Deposit Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your deposit has been successfully confirmed.</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>\n<p>Amount: %AMOUNT% %CURRENCY%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: '["FIRSTNAME", "TRANSACTION_ID", "AMOUNT", "CURRENCY"]',
    email: true,
  },
  {
    id: 27,
    name: 'TransferConfirmation',
    subject: 'Transfer Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your transfer has been successfully completed.</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>\n<p>Amount: %AMOUNT% %CURRENCY%</p>\n<p>To: %RECIPIENT_NAME%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes:
      '["FIRSTNAME", "TRANSACTION_ID", "AMOUNT", "CURRENCY", "RECIPIENT_NAME"]',
    email: true,
  },
  {
    id: 28,
    name: 'NewForexInvestmentCreated',
    subject: 'New Forex Investment Initiated',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have successfully created a new Forex investment in the %PLAN_NAME% plan.</p>\n<p>Amount Invested: %AMOUNT%</p>\n<p>Duration: %DURATION% %TIMEFRAME%</p>\n<p>Status: %STATUS%</p>',
    short_codes: [
      'FIRSTNAME',
      'PLAN_NAME',
      'AMOUNT',
      'DURATION',
      'TIMEFRAME',
      'STATUS',
    ],
    email: true,
  },
  {
    id: 29,
    name: 'ForexInvestmentCompleted',
    subject: 'Forex Investment Completed',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your Forex investment in the %PLAN_NAME% plan has been completed.</p>\n<p>Invested Amount: %AMOUNT%</p>\n<p>Result: %PROFIT%</p>\n<p>Status: %STATUS%</p>',
    short_codes: ['FIRSTNAME', 'PLAN_NAME', 'AMOUNT', 'PROFIT', 'STATUS'],
    email: true,
  },
  {
    id: 30,
    name: 'ForexInvestmentCanceled',
    subject: 'Forex Investment Canceled',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>Your Forex investment in the %PLAN_NAME% plan has been canceled.</p>\n<p>Amount Refunded: %AMOUNT%</p>\n<p>Status: %STATUS%</p>',
    short_codes: ['FIRSTNAME', 'PLAN_NAME', 'AMOUNT', 'STATUS'],
    email: true,
  },
  {
    id: 31,
    name: 'ForexDepositConfirmation',
    subject: 'Forex Deposit Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have successfully deposited into your Forex account.</p>\n<p>Account ID: %ACCOUNT_ID%</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>\n<p>Amount: %AMOUNT% %CURRENCY%</p>\n<p>Status: %STATUS%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: [
      'FIRSTNAME',
      'ACCOUNT_ID',
      'TRANSACTION_ID',
      'AMOUNT',
      'CURRENCY',
      'STATUS',
    ],
    email: true,
  },
  {
    id: 32,
    name: 'ForexWithdrawalConfirmation',
    subject: 'Forex Withdrawal Confirmation',
    email_body:
      '<p>Dear %FIRSTNAME%,</p>\n<p>You have successfully withdrawn from your Forex account.</p>\n<p>Account ID: %ACCOUNT_ID%</p>\n<p>Transaction ID: %TRANSACTION_ID%</p>\n<p>Amount: %AMOUNT% %CURRENCY%</p>\n<p>Status: %STATUS%</p>\n<p>Best regards,</p>\n<p>Your Support Team</p>',
    short_codes: [
      'FIRSTNAME',
      'ACCOUNT_ID',
      'TRANSACTION_ID',
      'AMOUNT',
      'CURRENCY',
      'STATUS',
    ],
    email: true,
  },
  {
    id: 33,
    name: 'IcoNewContribution',
    subject: 'Confirmation of Your ICO Contribution',
    email_body: `
      <p>Dear %FIRSTNAME%,</p>
      <p>Thank you for your contribution to the %TOKEN_NAME% ICO.</p>
      <p>Details of your contribution:</p>
      <ul>
        <li>Token: %TOKEN_NAME%</li>
        <li>Phase: %PHASE_NAME%</li>
        <li>Amount: %AMOUNT% %CURRENCY%</li>
        <li>Contribution Status: %CONTRIBUTION_STATUS%</li>
        <li>Date: %DATE%</li>
      </ul>
      <p>If you have any questions, please feel free to reach out to us.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: [
      'FIRSTNAME',
      'TOKEN_NAME',
      'PHASE_NAME',
      'AMOUNT',
      'CURRENCY',
      'CONTRIBUTION_STATUS',
      'DATE',
    ],
    email: true,
  },
  {
    id: 34,
    name: 'IcoContributionPaid',
    subject: 'Your ICO Contribution Tokens Have Been Dispatched',
    email_body: `
      <p>Dear %FIRSTNAME%,</p>
      <p>We are pleased to inform you that the tokens for your contribution to the %TOKEN_NAME% ICO have been dispatched.</p>
      <p>Details of your transaction:</p>
      <ul>
        <li>Token: %TOKEN_NAME%</li>
        <li>Phase: %PHASE_NAME%</li>
        <li>Amount: %AMOUNT% %CURRENCY%</li>
        <li>Transaction ID: %TRANSACTION_ID%</li>
        <li>Date: %DATE%</li>
      </ul>
      <p>Please check your wallet to confirm the receipt of your tokens.</p>
      <p>If you have any questions or did not receive your tokens, please contact support immediately.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: [
      'FIRSTNAME',
      'TOKEN_NAME',
      'PHASE_NAME',
      'AMOUNT',
      'CURRENCY',
      'TRANSACTION_ID',
      'DATE',
    ],
    email: true,
  },
  {
    id: 35,
    name: 'StakingInitiationConfirmation',
    subject: 'Confirmation of Your Staking Initiation',
    email_body: `
      <p>Dear %FIRSTNAME%,</p>
      <p>Your staking has been successfully initiated.</p>
      <p>Details of your stake:</p>
      <ul>
        <li>Token: %TOKEN_NAME%</li>
        <li>Amount: %STAKE_AMOUNT% %TOKEN_SYMBOL%</li>
        <li>Stake Date: %STAKE_DATE%</li>
        <li>Release Date: %RELEASE_DATE%</li>
        <li>Expected Reward: %EXPECTED_REWARD% %TOKEN_SYMBOL%</li>
      </ul>
      <p>Your funds are now earning rewards!</p>
      <p>If you have any questions, please feel free to reach out to us.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: [
      'FIRSTNAME',
      'TOKEN_NAME',
      'STAKE_AMOUNT',
      'TOKEN_SYMBOL',
      'STAKE_DATE',
      'RELEASE_DATE',
      'EXPECTED_REWARD',
    ],
    email: true,
  },
  {
    id: 36,
    name: 'StakingRewardDistribution',
    subject: 'Your Staking Rewards Have Been Distributed',
    email_body: `
      <p>Dear %FIRSTNAME%,</p>
      <p>We are pleased to inform you that rewards for your staking have been distributed to your account.</p>
      <p>Details of the reward distribution:</p>
      <ul>
        <li>Token: %TOKEN_NAME%</li>
        <li>Reward Amount: %REWARD_AMOUNT% %TOKEN_SYMBOL%</li>
        <li>Distribution Date: %DISTRIBUTION_DATE%</li>
      </ul>
      <p>Thank you for staking with us, and enjoy your earnings!</p>
      <p>If you have any questions or concerns about your rewards, please contact support.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: [
      'FIRSTNAME',
      'TOKEN_NAME',
      'REWARD_AMOUNT',
      'TOKEN_SYMBOL',
      'DISTRIBUTION_DATE',
    ],
    email: true,
  },
  {
    id: 37,
    name: 'OrderConfirmation',
    subject: 'Thank You for Your Order!',
    email_body: `
      <p>Dear %CUSTOMER_NAME%,</p>
      <p>Thank you for shopping with us. Your order has been successfully placed.</p>
      <p>Order Details:</p>
      <ul>
        <li>Order Number: %ORDER_NUMBER%</li>
        <li>Order Date: %ORDER_DATE%</li>
        <li>Total Amount: %ORDER_TOTAL%</li>
      </ul>
      <p>You can track your order status in your account.</p>
      <p>If you have any questions, please contact our customer service team.</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: ['CUSTOMER_NAME', 'ORDER_NUMBER', 'ORDER_DATE', 'ORDER_TOTAL'],
    email: true,
  },
  {
    id: 38,
    name: 'OrderStatusUpdate',
    subject: 'Update on Your Order - Action Required',
    email_body: `
      <p>Dear %CUSTOMER_NAME%,</p>
      <p>Your recent order with us (Order No: %ORDER_NUMBER%) has been updated to %ORDER_STATUS%.</p>
      <p>Please find below the details of your purchase:</p>
      <ul>
        %PRODUCT_DETAILS%
      </ul>
      <p>If your order status is 'COMPLETED', your product keys (if applicable) are available and can be accessed through your account or the provided links.</p>
      <p>If you have any questions or require further assistance, please do not hesitate to contact our support team.</p>
      <p>Thank you for choosing our services!</p>
      <p>Best regards,</p>
      <p>Your Support Team</p>
    `,
    short_codes: [
      'CUSTOMER_NAME',
      'ORDER_NUMBER',
      'ORDER_STATUS',
      'PRODUCT_DETAILS',
    ],
    email: true,
  },
  {
    id: 39,
    name: 'P2PTradeSaleConfirmation',
    subject: 'Confirmation of Your P2P Trade Sale',
    email_body:
      '<p>Dear %SELLER_NAME%,</p><p>A trade has been initiated on your offer for %CURRENCY%.</p><p>Trade Details:</p><ul><li>Buyer: %BUYER_NAME%</li><li>Amount: %AMOUNT% %CURRENCY%</li><li>Price: %PRICE%</li><li>Trade ID: %TRADE_ID%</li></ul><p>Please respond to the buyer to proceed with the trade.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: [
      'SELLER_NAME',
      'BUYER_NAME',
      'CURRENCY',
      'AMOUNT',
      'PRICE',
      'TRADE_ID',
    ],
    email: true,
  },
  {
    id: 40,
    name: 'P2PTradeReply',
    subject: 'New Message in Your P2P Trade',
    email_body:
      '<p>Dear %RECEIVER_NAME%,</p><p>You have a new message in your P2P trade with %SENDER_NAME%.</p><p>Trade ID: %TRADE_ID%</p><p>Message:</p><p>%MESSAGE%</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['RECEIVER_NAME', 'SENDER_NAME', 'TRADE_ID', 'MESSAGE'],
    email: true,
  },
  {
    id: 41,
    name: 'P2PDisputeOpened',
    subject: 'Dispute Opened for Your P2P Trade',
    email_body:
      '<p>Dear %PARTICIPANT_NAME%,</p><p>A dispute has been opened for your trade with %OTHER_PARTY_NAME%.</p><p>Trade ID: %TRADE_ID%</p><p>Dispute Reason:</p><p>%DISPUTE_REASON%</p><p>Our support team will review the dispute and contact you shortly.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: [
      'PARTICIPANT_NAME',
      'OTHER_PARTY_NAME',
      'TRADE_ID',
      'DISPUTE_REASON',
    ],
    email: true,
  },
  {
    id: 42,
    name: 'P2PDisputeResolution',
    subject: 'Dispute Resolution Update for Your P2P Trade',
    email_body:
      '<p>Dear %PARTICIPANT_NAME%,</p><p>The dispute for your trade ID: %TRADE_ID% has a new resolution update.</p><p>Resolution Message:</p><p>%RESOLUTION_MESSAGE%</p><p>Please review the resolution and follow any necessary steps.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['PARTICIPANT_NAME', 'TRADE_ID', 'RESOLUTION_MESSAGE'],
    email: true,
  },
  {
    id: 43,
    name: 'P2PDisputeResolving',
    subject: 'Your P2P Trade Dispute is Being Resolved',
    email_body:
      '<p>Dear %PARTICIPANT_NAME%,</p><p>Your trade dispute for Trade ID: %TRADE_ID% is in the process of being resolved.</p><p>Our team is working diligently to resolve the issue. We appreciate your patience.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['PARTICIPANT_NAME', 'TRADE_ID'],
    email: true,
  },
  {
    id: 44,
    name: 'P2PDisputeClosing',
    subject: 'Closure of Your P2P Trade Dispute',
    email_body:
      '<p>Dear %PARTICIPANT_NAME%,</p><p>The dispute for your trade ID: %TRADE_ID% has been closed.</p><p>We hope the resolution was satisfactory. If you have any further questions, please contact our support team.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['PARTICIPANT_NAME', 'TRADE_ID'],
    email: true,
  },
  {
    id: 45,
    name: 'P2PTradeCompletion',
    subject: 'Confirmation of Completed P2P Trade',
    email_body:
      '<p>Dear %SELLER_NAME%,</p><p>Your trade with %BUYER_NAME% for %AMOUNT% %CURRENCY% has been completed successfully.</p><p>Trade ID: %TRADE_ID%</p><p>Thank you for using our P2P platform.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: [
      'SELLER_NAME',
      'BUYER_NAME',
      'AMOUNT',
      'CURRENCY',
      'TRADE_ID',
    ],
    email: true,
  },
  {
    id: 46,
    name: 'P2PTradeCancellation',
    subject: 'Cancellation of Your P2P Trade',
    email_body:
      '<p>Dear %PARTICIPANT_NAME%,</p><p>Your trade ID: %TRADE_ID% has been cancelled.</p><p>If you have any questions or concerns, please contact our support team.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['PARTICIPANT_NAME', 'TRADE_ID'],
    email: true,
  },
  {
    id: 47,
    name: 'P2PTradePaymentConfirmation',
    subject: 'Payment Confirmation for Your P2P Trade',
    email_body:
      '<p>Dear %SELLER_NAME%,</p><p>%BUYER_NAME% has marked the trade ID: %TRADE_ID% as paid.</p><p>Transaction ID: %TRANSACTION_ID%</p><p>Please confirm the payment on your end to complete the trade.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['SELLER_NAME', 'BUYER_NAME', 'TRADE_ID', 'TRANSACTION_ID'],
    email: true,
  },
  {
    id: 48,
    name: 'P2PReviewNotification',
    subject: 'New Review for Your P2P Offer',
    email_body:
      '<p>Dear %SELLER_NAME%,</p><p>You have received a new review for your offer ID: %OFFER_ID%.</p><p>Reviewer: %REVIEWER_NAME%</p><p>Rating: %RATING%</p><p>Comment: %COMMENT%</p><p>Thank you for providing a quality service on our platform.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: [
      'SELLER_NAME',
      'OFFER_ID',
      'REVIEWER_NAME',
      'RATING',
      'COMMENT',
    ],
    email: true,
  },
  {
    id: 49,
    name: 'P2POfferAmountDepletion',
    subject: 'Notification of Offer Amount Depletion',
    email_body:
      '<p>Dear %SELLER_NAME%,</p><p>The available amount for your offer ID: %OFFER_ID% is running low.</p><p>Current Amount: %CURRENT_AMOUNT% %CURRENCY%</p><p>Consider updating your offer to continue trading.</p><p>Best regards,</p><p>Your Support Team</p>',
    short_codes: ['SELLER_NAME', 'OFFER_ID', 'CURRENT_AMOUNT', 'CURRENCY'],
    email: true,
  },
]

async function main() {
  const emailTemplatePromises = notificationTemplates.map((template) => {
    return prisma.notification_templates.upsert({
      where: { id: template.id },
      update: { short_codes: template.short_codes },
      create: template,
    })
  })
  await Promise.all(emailTemplatePromises)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
