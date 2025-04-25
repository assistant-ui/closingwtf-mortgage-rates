import {
  AttachmentAdapter,
  PendingAttachment,
  CompleteAttachment,
} from "@assistant-ui/react";
import { nanoid } from "nanoid"; // Assuming nanoid is installed for ID generation

export class PDFAttachmentAdapter implements AttachmentAdapter {
  accept = ".pdf";

  async add({ file }: { file: File }): Promise<PendingAttachment> {
    const id = nanoid(); // Use nanoid for unique ID
    console.log("Adding PDF:", file.name);
    return {
      id,
      type: "document", // Set type to 'document' for PDF
      name: file.name,
      contentType: file.type,
      file, // Include the file object
      status: { type: "requires-action", reason: "composer-send" }, // Match image adapter status
    };
  }

  async send(attachment: PendingAttachment): Promise<CompleteAttachment> {
    console.log("Sending PDF:", attachment.name);
    // Placeholder for actual PDF processing/upload logic if needed
    // await processOrUploadPDF(attachment.file);

    return {
      ...attachment,
      status: { type: "complete" }, // Match image adapter status
      content: [ // Represent PDF in content array
        {
          type: "text", // Use 'text' type for basic representation
          text: `Attached PDF: ${attachment.name}`, // Example text content
        },
      ],
      // You might clear the file object after sending if it's not needed
      // file: undefined,
    };
  }

  async remove(attachment: PendingAttachment | CompleteAttachment): Promise<void> {
    console.log("Removing PDF:", attachment.name);
    // Add custom logic for removing the attachment if necessary (e.g., delete from server)
  }
}
