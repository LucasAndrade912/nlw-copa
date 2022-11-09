import { useState } from 'react'
import { Heading, useToast, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'

import { api } from '../lib/api'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'

export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')

  const { navigate } = useNavigation()
  const toast = useToast()

  async function handleJoinPool() {
    try {
      setIsLoading(true)

      if(!code.trim()) {
        toast.show({
          title: 'Informe o código do bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      
      await api.post('/pools/join', { code })

      setIsLoading(false)
      setCode('')

      toast.show({
        title: 'Você entrou no bolão!',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('pools')
    } catch (err) {
      setIsLoading(false)
      console.log(err)

      if (err?.response?.data?.message === 'Pool not found.') {
        return toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if (err?.response?.data?.message === 'You already joined this pool.') {
        return toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading color="white" fontFamily="heading" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do seu bolão?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          onPress={handleJoinPool}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  )
}