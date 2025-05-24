import React from 'react'
import CampaignDetailSection from '@/modules/CampaignModule/sections/CampaignDetailSection'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <CampaignDetailSection params={params}/>
    </div>
  )
}

export default page