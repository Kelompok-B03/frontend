import React from 'react'
import CampaignDetailSection from '@/modules/CampaignModule/sections/CampaignDetailSection'

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps ) => {
  const { id } = await params;
  
  return (
    <div>
      <CampaignDetailSection campaignId={id}/>
    </div>
  )
}

export default page