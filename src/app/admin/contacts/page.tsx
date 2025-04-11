import prisma from '@/lib/prisma';
import ContactList from '@/components/admin/ContactList';

export default async function ContactsPage() {
  try {
    console.log('Fetching contacts for admin page');
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    console.log('Found contacts:', contacts);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
        <ContactList contacts={contacts} />
      </div>
    );
  } catch (error) {
    console.error('Error in admin contacts page:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
        <p className="text-red-600">Error loading contact messages. Please try again later.</p>
      </div>
    );
  }
} 