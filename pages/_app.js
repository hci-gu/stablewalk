import '../styles/globals.css'
import Head from 'next/head'
import { MantineProvider, Tabs } from '@mantine/core'
import { useControls } from 'leva'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const router = useRouter()

  return (
    <div style={{ margin: '64px auto', width: '85%' }}>
      <Tabs value={router.pathname} onTabChange={(value) => router.push(value)}>
        <Tabs.List>
          <Tabs.Tab value="/">Grid</Tabs.Tab>
          <Tabs.Tab value="/combine">Combine</Tabs.Tab>
          <Tabs.Tab value="/canvas">Canvas</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <div style={{ marginTop: '24px' }}>{children}</div>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  const { dark } = useControls({ dark: false })

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: dark ? 'dark' : 'light',
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </>
  )
}

export default MyApp
