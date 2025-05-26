import React from 'react'
import CampaignDetailSection from '@/modules/CampaignModule/sections/CampaignDetailSection'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <CampaignDetailSection campaignId={params.id}/>
    </div>
  )
}

export default page