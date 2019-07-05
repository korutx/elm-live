// Dependencies
import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Either from 'data.either'
import { safePath } from 'safe-prop'

// Components
import { GithubIcon, LogoIcon, MenuIcon, WebIcon } from "../components/icons"

function getStats (data) {
  const forks = safePath(['repository', 'forkCount'], data)
  const stars = safePath(['repository', 'stargazers', 'totalCount'], data)
  const version = safePath(['repository', 'releases', 'nodes'], data)
    .map(a => a[0])
    .chain(safePath(['tag', 'name']))

  return Either
    .of(a => b => c => [{ name: 'Forks', value: a }, { name: 'Stars', value: b }, { name: 'Version', value: c }])
    .ap(forks)
    .ap(stars)
    .ap(version)
}

const getRepoUrl = safePath(['repository', 'url'])

const renderStats = stats => (
  <ul className="flex border-t-2 border-black">
    {stats.map(({ name, value }) => (
      <li className="stat flex-1 pt-4 mr-4" key={`${name}-${value}`} >
        <p className="text-sm leading-none mb-1">{name}</p>
        <p className="text-4xl font-bold leading-none">{value}</p>
      </li>
    ))}
  </ul>
)

const Layout = ({ children }) => {

  const data = useStaticQuery(
    graphql`
      query {
        github {
          repository(owner: "wking-io", name: "elm-live") {
            forkCount
            url
            releases(first: 1, orderBy: { field: CREATED_AT, direction: DESC } ) {
              nodes {
                tag {
                  name
                }
              }
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    `
  )

  const stats = getStats(data.github)
  const repoUrl = getRepoUrl(data.github).getOrElse('https://github.com/wking-io/elm-live')

  return (
    <div className="font-sans text-black flex">
      <header className="p-8 w-1/3 max-w-md flex-shrink-0 flex flex-col space-between h-screen fixed z-10 bg-white">
        <h1 className="flex items-center font-bold mb-12">
          <span className="h-8 mr-2"><LogoIcon /></span>
          <span className="leading-none">elm-live</span>
        </h1>
        <div className="flex-1">
          <h2 className="text-2xl mb-4 font-bold leading-tight">A flexible dev server for Elm. Live reload included.</h2>
          <p>A thin wrapper around elm make, elm-live is a dev server that gives you a few extra convenience features during development. Features include pushstate for SPA development, proxies, and more. Usage and API documentation is below. Check out <a className="link" href="#getting-started">how to get started</a> or jump straight to the <a className="link" href="#documentation">API Documentation</a>.</p>
        </div>
        <div>
          <p className="mb-4"><strong>Would you be willing to answer a few questions to help improve development in elm?</strong></p>
          <Link to="/surveys/2019" className="btn btn--primary block mb-6">Take the quick survey</Link>
        </div>
        {stats.fold(console.log, renderStats)}
      </header>
      <nav className="fixed w-2/3 right-0 nav bg-grey-light px-12 z-10 xl:px-16">
        <div className="flex pt-8 border-b-2 border-black max-w-4xl mx-auto">
          <ul className="flex flex-1">
            <li className="text-sm"><a className="block mr-6 pb-3 border-b-2 border-grey-light hover:border-black" href="#getting-started">Getting Started</a></li>
            <li className="text-sm"><a className="block pb-3 border-b-2 border-grey-light hover:border-black" href="#documentation">Documentation</a></li>
          </ul>
          <ul className="flex">
            <li className="h-4 w-auto mr-4"><a href="https://wking.io"><WebIcon/></a></li>
            <li className="h-4 w-auto mr-4"><a href={repoUrl} ><GithubIcon/></a></li>
            <li className="h-4 w-auto"><button className="w-4"><MenuIcon/></button></li>
          </ul>
        </div>
      </nav>
      <main className="content relative bg-grey-light pt-32 px-12 xl:px-16 w-2/3 ml-auto">
        {children}
      </main>
    </div>
  )
}

export default Layout