import { Button, Flex, Spinner, Switch, Text, Textarea } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import type { NextPage } from 'next'

import WithContext from '../context/WithContext'
import { useState } from 'react'
import axios from 'axios'

const DEFAULT_INPUT = `他可以向邓小平学习，将危机的政治潜力发挥到极致。上世纪70年代末毛泽东去世后，邓小平重新掌权，当时中共正面临存亡危机：毛泽东的独裁使中国陷入贫困，让中共元气大伤。邓小平抓住时机，抛弃了毛泽东对共产主义理想国的幻想，转而支持政治稳定和提升生活水平。党与人民达成新的约定。`
const DEFAULT_TRANSLATION = `He can learn from Deng Xiaoping and maximize the political potential of crisis. After Mao Zedong's death in the late 1970s, Deng Xiaoping regained power when the Chinese Communist Party was facing a crisis of survival: Mao Zedong's dictatorship had plunged China into poverty and severely damaged the morale of the CCP. Deng Xiaoping seized the opportunity, abandoned Mao Zedong's dream of a communist ideal state, and instead supported political stability and improved living standards. The party and the people reached a new agreement.`

const InitialPage: NextPage = () => {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [translation, setTranslation] = useState<string | null>(
    DEFAULT_TRANSLATION
  )
  const [isLoading, setIsLoading] = useState(false)
  const [activeTone, setActiveTone] = useState('formal')
  const [translateTo, setTranslateTo] = useState('english')

  const handleTranslate = async () => {
    if (!!input.length) {
      setIsLoading(true)
      setTranslation(null)

      const { data } = await axios.post('http://localhost:8000/translation', {
        input,
        tone: activeTone,
        translateToLng: translateTo,
      })

      setIsLoading(false)

      setTranslation(data.translation)
    }
  }

  return (
    <WithContext>
      <Flex
        direction="column"
        minHeight="100vh"
        maxWidth="1920px"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          width="850px"
          padding="40px"
        >
          <Text fontWeight="semibold" fontSize="18px">
            translate AI
          </Text>
          <Textarea
            marginTop="4px"
            value={input}
            boxShadow="sm"
            height="200px"
            onChange={(e) => setInput(e.target.value)}
          />
          <Flex direction="column" marginTop="10px" alignItems="center">
            <Flex gap="6px" marginTop="4px">
              <ToneBadge
                toneLabel={'Formal'}
                isActive={activeTone === 'formal'}
                setActiveTone={() => setActiveTone('formal')}
              />
              <ToneBadge
                toneLabel={'Casual'}
                isActive={activeTone === 'casual'}
                setActiveTone={() => setActiveTone('casual')}
              />
              <ToneBadge
                toneLabel={'Sassy'}
                isActive={activeTone === 'sassy'}
                setActiveTone={() => setActiveTone('sassy')}
              />
              <ToneBadge
                toneLabel={'Sarcastic'}
                isActive={activeTone === 'sarcastic'}
                setActiveTone={() => setActiveTone('sarcastic')}
              />
            </Flex>
          </Flex>

          <Flex marginTop="20px" alignItems="center" gap="4px" fontSize="14px">
            <Text
              fontWeight={translateTo === 'english' ? 'semibold' : ''}
              onClick={() => setTranslateTo('english')}
              cursor="pointer"
            >
              to english
            </Text>
            <Switch
              isChecked={translateTo === 'chinese'}
              onChange={() =>
                setTranslateTo((prev) =>
                  prev === 'chinese' ? 'english' : 'chinese'
                )
              }
            />
            <Text
              fontWeight={translateTo === 'chinese' ? 'semibold' : ''}
              onClick={() => setTranslateTo('chinese')}
              cursor="pointer"
            >
              to chinese
            </Text>
          </Flex>

          <Button
            marginTop="20px"
            isDisabled={!input.length}
            onClick={handleTranslate}
            height="50px"
            width="200px"
            colorScheme="teal"
          >
            Translate
          </Button>
          {isLoading && <Spinner marginTop="20px" size="lg" color="teal" />}
          <Flex marginTop="20px">
            <Text>{translation}</Text>
          </Flex>
        </Flex>
      </Flex>
    </WithContext>
  )
}

const ToneBadge = ({
  toneLabel,
  isActive,
  setActiveTone,
}: {
  toneLabel: string
  isActive: boolean
  setActiveTone: () => void
}) => {
  return (
    <Flex
      border="1px"
      borderColor={isActive ? 'teal' : 'gray.400'}
      background={isActive ? 'teal' : ''}
      color={isActive ? 'white' : 'gray.600'}
      boxShadow={isActive ? 'md' : 'sm'}
      rounded="xl"
      paddingX="20px"
      paddingY="4px"
      cursor="pointer"
      onClick={setActiveTone}
    >
      {toneLabel}
    </Flex>
  )
}

export const getStaticProps: GetStaticProps = () => {
  // const data = fetchProps()
  const data = {
    data: {},
  }

  return {
    props: {
      data,
    },
  }
}

// export const getStaticPaths: GetStaticPaths = () => {
//   // const data = fetchProps()

//   return {
//     paths: [],
//     fallback: false,
//   }
// }

export default InitialPage
