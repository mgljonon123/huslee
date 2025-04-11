import React from 'react';
import Image from 'next/image';

interface ProfileProps {
  profile: {
    name: string;
    image: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ profile }) => {
  return (
    <div className="relative w-32 h-32">
      <Image
        src={profile.image || '/profile-placeholder.svg'}
        alt={profile.name}
        width={128}
        height={128}
        className="object-cover w-full h-full rounded-full"
        onError={(e) => {
          e.currentTarget.src = '/profile-placeholder.svg';
        }}
      />
    </div>
  );
};

export default Profile; 