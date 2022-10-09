/* eslint-disable no-use-before-define */
import type { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { OurTeamContent } from '~/components/ourTeam'

export default function Team({ data }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('Team Data', data)

  return (
    <>
      <NextSeo
        title="Our Team | Tucker Tub"
        description="Our Team Description"
        openGraph={{
          title: 'Our Team | Tucker Tub',
          description: 'Our Team Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />

      <Layout>
        <OurTeamContent teamData={data} />
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const teamQuery = `
  query allTeamMembers {
    teamMembers(first: 100) {
      edges {
        node {
          id
          title
          status
          Team {
            bio
            memberFacebook
            memberPhone
            memberRegion
          }
          featuredImage {
            node {
              id
              altText
              link
              sourceUrl
              mediaDetails {
                height
                width
              }
            }
          }
        }
      }
    }
  }
 
  `

  const response = await fetch(`${process.env.WORDPRESS_ENDPOINT}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: teamQuery
    })
  })

  const data = await response.json()

  const teamData = data.data.teamMembers.edges.map(teamMember => {
    return teamMember
  })

  const publishedTeamData = teamData.filter(teamMember => {
    return teamMember.node.status === 'publish'
  })

  return {
    props: {
      data: publishedTeamData
    }
  }
}
