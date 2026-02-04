import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface UserDetails {
    name: string;
    email?: string;
    phone?: string;
    pan?: string;
    address?: string;
}

interface ReceiptDetails {
    receiptNo: string;
    date: string;
    eligible80G: boolean;
    type: string;
    amount: number;
}

export const generateGenericPDF = (
    title: string,
    content: string[],
    fileName: string,
    user: { name: string; pan?: string },
    tableData?: { head: string[][]; body: string[][] }
) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(243, 106, 79); // #F36A4F
        doc.text('ARAM FOUNDATION', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Tiruppur, Tamil Nadu, India', 105, 28, { align: 'center' });
        doc.text('Email: info@aramfoundation.org | Web: www.aramfoundation.org', 105, 33, { align: 'center' });

        doc.setDrawColor(219, 219, 219);
        doc.line(20, 40, 190, 40);

        // Title
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(title, 105, 50, { align: 'center' });

        // User Details
        doc.setFontSize(11);
        doc.text('Donor Details:', 20, 65);
        doc.setFont('helvetica', 'bold');
        doc.text(user.name, 20, 72);
        doc.setFont('helvetica', 'normal');
        doc.text(`PAN: ${user.pan || 'N/A'}`, 20, 78);

        // Content Lines
        let currentY = 95;
        content.forEach((line) => {
            doc.text(line, 20, currentY);
            currentY += 8;
        });

        // Table
        if (tableData) {
            autoTable(doc, {
                startY: currentY + 10,
                head: tableData.head,
                body: tableData.body,
                headStyles: { fillColor: [243, 106, 79], textColor: [255, 255, 255] },
                theme: 'striped',
            });
        }

        doc.save(fileName);
        toast.success(`${title} downloaded successfully`);
    } catch (error) {
        console.error('PDF Generation Error:', error);
        toast.error('Failed to generate PDF');
    }
};

export const generateReceiptPDF = (receipt: ReceiptDetails, user: UserDetails) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(243, 106, 79); // #F36A4F
        doc.text('ARAM FOUNDATION', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Tiruppur, Tamil Nadu, India', 105, 28, { align: 'center' });
        doc.text('Email: info@aramfoundation.org | Web: www.aramfoundation.org', 105, 33, { align: 'center' });

        doc.setDrawColor(219, 219, 219);
        doc.line(20, 40, 190, 40);

        // Receipt Title
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('DONATION RECEIPT', 105, 50, { align: 'center' });

        // Donor Details
        doc.setFontSize(11);
        doc.text('Donor Details:', 20, 65);
        doc.setFont('helvetica', 'bold');
        doc.text(user.name, 20, 72);
        doc.setFont('helvetica', 'normal');

        let currentY = 78;
        if (user.email) {
            doc.text(`Email: ${user.email}`, 20, currentY);
            currentY += 6;
        }
        if (user.phone) {
            doc.text(`Phone: ${user.phone}`, 20, currentY);
            currentY += 6;
        }
        if (user.pan) {
            doc.text(`PAN: ${user.pan}`, 20, currentY);
            currentY += 6;
        }
        if (user.address) {
            const splitAddress = doc.splitTextToSize(`Address: ${user.address}`, 80);
            doc.text(splitAddress, 20, currentY);
        }

        // Receipt Info (Right side)
        doc.text(`Receipt No: ${receipt.receiptNo}`, 120, 72);
        doc.text(`Date: ${receipt.date}`, 120, 78);
        doc.text(`80G Eligible: ${receipt.eligible80G ? 'Yes' : 'No'}`, 120, 84);

        // Donation Table
        autoTable(doc, {
            startY: 115,
            head: [['Description', 'Amount']],
            body: [[receipt.type, `INR ${receipt.amount.toLocaleString()}`]],
            headStyles: { fillColor: [243, 106, 79], textColor: [255, 255, 255] },
            theme: 'striped',
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY || 130;
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: INR ${receipt.amount.toLocaleString()}`, 190, finalY + 15, { align: 'right' });

        // Footer Note
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100);
        const note = receipt.eligible80G
            ? 'This is a computer generated receipt and does not require a physical signature. Your donation is eligible for 80G tax exemption.'
            : 'This is a computer generated receipt and does not require a physical signature.';
        const splitNote = doc.splitTextToSize(note, 170);
        doc.text(splitNote, 20, finalY + 40);

        doc.save(`Receipt_${receipt.receiptNo}.pdf`);
        toast.success('Receipt downloaded successfully');
    } catch (error) {
        console.error('PDF Generation Error:', error);
        toast.error('Failed to generate PDF');
    }
};

export const generateNotificationsPDF = (notifications: any[]) => {
    try {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(243, 106, 79); // #F36A4F
        doc.text('ARAM FOUNDATION', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Tiruppur, Tamil Nadu, India', 105, 28, { align: 'center' });
        doc.text('Email: info@aramfoundation.org | Web: www.aramfoundation.org', 105, 33, { align: 'center' });

        doc.setDrawColor(219, 219, 219);
        doc.line(20, 40, 190, 40);

        // Title
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('NOTIFICATIONS', 105, 50, { align: 'center' });

        // Table
        const tableBody = notifications.map(notif => [
            new Date(notif.createdAt).toLocaleDateString(),
            notif.title,
            notif.message,
            notif.type.toUpperCase()
        ]);

        autoTable(doc, {
            startY: 60,
            head: [['Date', 'Title', 'Message', 'Type']],
            body: tableBody,
            headStyles: { fillColor: [243, 106, 79], textColor: [255, 255, 255], halign: 'left' },
            theme: 'striped',
            styles: {
                overflow: 'linebreak',
                cellPadding: 4,
                fontSize: 10,
                valign: 'top'
            },
            columnStyles: {
                0: { cellWidth: 28 }, // Date
                1: { cellWidth: 38, fontStyle: 'bold' }, // Title
                2: { cellWidth: 'auto' }, // Message
                3: { cellWidth: 35, halign: 'center' } // Type
            },
            margin: { top: 60, left: 15, right: 15, bottom: 20 }
        });

        doc.save(`Notifications_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('Notifications downloaded successfully');
    } catch (error) {
        console.error('PDF Generation Error:', error);
        toast.error('Failed to generate PDF');
    }
};
