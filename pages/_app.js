import '../styles/globals.css'
import Head from 'next/head'
import {
  ActionIcon,
  AppShell,
  ColorSchemeProvider,
  Container,
  Divider,
  Flex,
  Header,
  MantineProvider,
  Tabs,
  useMantineColorScheme,
} from '@mantine/core'
import { useControls } from 'leva'
import { useRouter } from 'next/router'
import {
  IconLayoutNavbarCollapse,
  IconLayoutNavbarExpand,
  IconMoonStars,
  IconSettings,
  IconSun,
} from '@tabler/icons'
import { useState } from 'react'
import PromptSettings from '../components/PromptsSettings'
import { ReactFlowProvider } from 'reactflow'

const DarkMode = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  )
}

const ToggleHeaderButton = ({ onClick, visible }) => {
  return (
    <ActionIcon
      variant="outline"
      onClick={onClick}
      color={'blue'}
      title="toggle header settings"
    >
      {visible ? (
        <IconLayoutNavbarCollapse size={18} />
      ) : (
        <IconLayoutNavbarExpand size={18} />
      )}
    </ActionIcon>
  )
}

const Layout = ({ children, pageHeader }) => {
  const router = useRouter()
  const [visible, setVisible] = useState(true)

  return (
    <AppShell
      header={
        <Header>
          <Tabs
            value={router.pathname}
            onTabChange={(value) => router.push(value)}
            pos="relative"
          >
            <Tabs.List p={4}>
              <Tabs.Tab value="/">Grid</Tabs.Tab>
              <Tabs.Tab value="/canvas">Canvas</Tabs.Tab>
              <Container pos="absolute" right={0} mt={4}>
                <DarkMode />
              </Container>
              <Container pos="absolute" right={40} mt={4}>
                <ToggleHeaderButton
                  onClick={() => setVisible(!visible)}
                  visible={visible}
                />
              </Container>
            </Tabs.List>
            {visible && (
              <Flex p="md" align="center" gap="md">
                <PromptSettings />
                <Divider orientation="vertical" />
                {pageHeader}
              </Flex>
            )}
          </Tabs>
        </Header>
      }
    >
      <Container pt={visible ? 225 : 60} h="100%" fluid>
        {children}
      </Container>
    </AppShell>
  )
}

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState('light')
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={(value) =>
          setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
        }
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ReactFlowProvider>
            <Layout pageHeader={Component.Header && <Component.Header />}>
              <Component {...pageProps} />
            </Layout>
          </ReactFlowProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  )
}

export default MyApp
