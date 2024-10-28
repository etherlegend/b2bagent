import React from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  HStack,
  Heading,
  Link,
  Switch,
  VStack,
  extendTheme,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaAddressCard, FaGithub, FaStop, FaTrash } from 'react-icons/fa';
import { HiMinus, HiX } from 'react-icons/hi';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { useDispatch } from 'zutron';
import { useStore } from './hooks/useStore';
import { RunHistory } from './RunHistory';

function Main() {
  const dispatch = useDispatch(window.zutron);
  const {
    instructions: savedInstructions,
    fullyAuto,
    running,
    error,
    runHistory,
  } = useStore();
  const [localInstructions, setLocalInstructions] = React.useState(
    savedInstructions ?? '',
  );
  const toast = useToast();

  const startRun = () => {
    dispatch({ type: 'SET_INSTRUCTIONS', payload: localInstructions });
    dispatch({ type: 'RUN_AGENT', payload: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      startRun();
    }
  };

  return (
    <Box
      position="relative"
      w="100%"
      h="100vh"
      p={4}
      bg="gray.900"
      sx={{
        '-webkit-app-region': 'drag',
      }}
    >
      <Box position="absolute" top={2} left={6}>
        <Heading fontFamily="'Space Grotesk', sans-serif" color="blue.200" fontSize="2xl">
          B2BAutoPilot
        </Heading>
        <Box color="gray.300" fontSize="sm">
          <b>ChemSupply</b> : Agent - Alex
        </Box>
      </Box>

      <HStack
        position="absolute"
        top={2}
        right={2}
        spacing={0}
        sx={{
          '-webkit-app-region': 'no-drag',
        }}
      >
        <Link
          href="https://b2bautopilot-git-preview-b2bautopilot.vercel.app/agent/1"
          isExternal
        >
          <Button variant="ghost" size="sm" aria-label="Profile" minW={8} p={0} color="gray.300" _hover={{ color: "blue.200" }}>
            <FaAddressCard />
          </Button>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.electron.windowControls.minimize()}
          minW={8}
          p={0}
          color="gray.300"
          _hover={{ color: "blue.200" }}
        >
          <HiMinus />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.electron.windowControls.close()}
          minW={8}
          p={0}
          color="gray.300"
          _hover={{ color: "blue.200" }}
        >
          <HiX />
        </Button>
      </HStack>

      <VStack
        spacing={4}
        align="center"
        h="100%"
        w="100%"
        pt={16}
        sx={{
          '& > *': {
            '-webkit-app-region': 'no-drag',
          },
        }}
      >
        <Box
          as="textarea"
          placeholder="What can I do for you today?"
          width="100%"
          height="auto"
          minHeight="48px"
          p={4}
          borderRadius="16px"
          border="1px solid"
          borderColor="gray.700"
          bg="gray.800"
          color="white"
          verticalAlign="top"
          resize="none"
          overflow="hidden"
          sx={{
            '-webkit-app-region': 'no-drag',
            transition: 'all 0.2s',
            _hover: {
              borderColor: 'gray.600',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            },
            _focus: {
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
              outline: 'none',
            },
            _placeholder: {
              color: 'gray.500',
            },
          }}
          value={localInstructions}
          disabled={running}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocalInstructions(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleKeyDown}
        />

        <HStack justify="space-between" align="center" w="100%" color="gray.300">
          <HStack spacing={2}>
            <Switch
              isChecked={fullyAuto}
              onChange={(e) => {
                toast({
                  description: "Whoops, automatic mode isn't actually implemented yet. 😬",
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
              colorScheme="blue"
            />
            <Box>Full Auto</Box>
          </HStack>
          <HStack>
            {running && <Spinner size="sm" color="blue.200" mr={2} />}
            {!running && runHistory.length > 0 && (
              <Button
                variant="ghost"
                color="gray.400"
                _hover={{ color: "red.300", bg: "whiteAlpha.100" }}
                onClick={() => dispatch('CLEAR_HISTORY')}
                aria-label="Clear history"
              >
                <FaTrash />
              </Button>
            )}
            <Button
              bg={running ? "red.600" : "blue.600"}
              color="white"
              _hover={{
                bg: running ? "red.700" : "blue.700",
              }}
              _active={{
                bg: running ? "red.800" : "blue.800",
              }}
              borderRadius="12px"
              onClick={running ? () => dispatch('STOP_RUN') : startRun}
              isDisabled={!running && localInstructions?.trim() === ''}
              leftIcon={running ? <FaStop /> : undefined}
            >
              {running ? 'Stop' : "Let's Go"}
            </Button>
          </HStack>
        </HStack>

        {error && (
          <Box w="100%" color="red.300" bg="red.900" p={3} borderRadius="md">
            {error}
          </Box>
        )}

        <Box flex="1" w="100%" overflow="auto">
          <RunHistory />
        </Box>
      </VStack>
    </Box>
  );
}

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'gray.100',
      },
    },
  },
  components: {
    Switch: {
      baseStyle: {
        track: {
          bg: 'gray.700',
          _checked: {
            bg: 'blue.600',
          },
        },
      },
    },
  },
});

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="gray.900" minHeight="100vh">
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}
