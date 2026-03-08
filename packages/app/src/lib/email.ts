import { Resource } from 'sst'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

const client = new SESv2Client()

export async function sendTransactional({
  subject,
  content,
  recipientEmail,
}: {
  subject: string
  content: string
  recipientEmail: string
  recipientName?: string
}) {
  await client.send(
    new SendEmailCommand({
      FromEmailAddress: `noreply@${Resource.climbingtopos2Email.sender}`,
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Text: { Data: content } },
        },
      },
    }),
  )
}
