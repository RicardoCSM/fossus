export interface EnderecoDto {
  id: number;
  rua: string;
  numero: number | null;
  cep: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface EnderecoRefDto {
  id: number;
  rua: string;
  numero: number | null;
}
