import Head from "next/head";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  FormControl,
  Input,
  Container,
  Button,
  SimpleGrid,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetchProduct } from "@/features/product/useProduct";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useCreateProduct } from "@/features/product/useCreateProduct";
import { useDeleteProduct } from "@/features/product/useDeleteProduct";

export default function Home() {
  const toast = useToast();
  const { products, isLoading, refetch: productRefetch } = useFetchProduct();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      description: "",
      image: "",
    },
    onSubmit: () => {
      const { name, price, description, image } = formik.values;
      createProduct({
        name,
        price,
        description,
        image,
      });
      formik.resetForm({ values: "" });
      toast({
        title: "Success added",
        status: "success",
      });
    },
  });

  const { mutate: createProduct, isLoading: postProductIsLoading } =
    useCreateProduct({
      onSuccess: () => [productRefetch()],
    });

  const { mutate: deletedProduct } = useDeleteProduct({
    onSuccess: () => {
      productRefetch(),
        toast({
          title: "Success deleted",
          status: "success",
        });
    },
  });

  const handleDeleteProduct = (id) => {
    const isYes = confirm("Are you sre want to delete this item");
    if (isYes) deletedProduct(id);
  };

  const renderDataProducts = () => {
    return products?.datas.map((product, index) => {
      return (
        <Tr key={product.id}>
          <Td>{index + 1}</Td>
          <Td>
            <Button
              colorScheme="red"
              onClick={() => handleDeleteProduct(product.id)}>
              Delete
            </Button>
          </Td>
          <Td>{product.name}</Td>
          <Td>Rp. {Number(product.price).toLocaleString("id-ID")}</Td>
          <Td>{product.description}</Td>
          <Td>{product.image}</Td>
        </Tr>
      );
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Container marginY={5}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired>
              <SimpleGrid columns={2} spacing={10}>
                <Input
                  placeholder="Name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <Input
                  placeholder="Price"
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                />
                <Input
                  placeholder="Description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                <Input
                  placeholder="Image Url"
                  name="image"
                  onChange={formik.handleChange}
                  value={formik.values.image}
                />
              </SimpleGrid>
              <Button
                colorScheme="gray"
                marginTop={4}
                type="submit"
                isLoading={postProductIsLoading}
                loadingText="Submitting">
                Submit
              </Button>
            </FormControl>
          </form>
        </Container>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>No</Th>
                <Th>Delete</Th>
                <Th>Name</Th>
                <Th>Price</Th>
                <Th>Description</Th>
                <Th>Image</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderDataProducts()}
              {isLoading && (
                <Tr>
                  <Td>
                    <Spinner />
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </main>
    </>
  );
}
